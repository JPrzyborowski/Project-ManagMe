import { useEffect, useState } from 'react'
import { Alert, Button, ButtonGroup } from 'react-bootstrap'
import { api } from '../api/ApiService'
import type { Project } from '../models/Project'
import type { Story } from '../models/Story'
import type { Task, TaskFormData } from '../models/Task'
import type { User } from '../models/User'
import { KanbanBoard } from './KanbanBoard'
import { TaskDetails } from './TaskDetails'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'

type Props = {
  project: Project
  users: User[]
}

type Mode = 'list' | 'kanban'

export function TasksView({ project, users }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [editing, setEditing] = useState<Task | undefined>()
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [mode, setMode] = useState<Mode>('list')

  async function reload() {
    setTasks(await api.getTaskByProject(project.id))
  }


  useEffect(() => {
    let cancelled = false

    Promise.all([api.getTaskByProject(project.id), api.getStoriesByProject(project.id)]).then(
      ([projectTasks, projectStories]) => {
        if (cancelled) return
        setTasks(projectTasks)
        setStories(projectStories)
        setLoaded(true)
      },
    )

    return () => {
      cancelled = true
    }
  }, [project.id])

  async function handleSubmit(data: TaskFormData) {
    if (editing) {
      await api.updateTask({ ...editing, ...data })
      setEditing(undefined)
    } else {
      await api.createTask(data)
    }
    await reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Na pewno usunąć zadanie?')) return
    await api.deleteTask(id)
    if (editing?.id === id) setEditing(undefined)
    if (selectedId === id) setSelectedId(undefined)
    await reload()
  }

  async function handleUpdate(task: Task) {
    await api.updateTask(task)
    await reload()
  }

  if (!loaded) return null

  const selectedTask = tasks.find((t) => t.id === selectedId)

  return (
    <section>
      <h2 className="h4">Zadania projektu: {project.name}</h2>
      <h3 className="h5">{editing ? 'Edycja zadania' : 'Nowe zadanie'}</h3>
      {stories.length === 0 ? (
        <Alert variant="info">
          Aby dodać zadanie, najpierw dodaj historyjkę w zakładce „Historyjki”.
        </Alert>
      ) : (
        <TaskForm
          key={editing?.id ?? 'new'}
          initial={editing}
          stories={stories}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(undefined)}
        />
      )}
      <ButtonGroup className="mb-3">
        <Button
          variant={mode === 'list' ? 'primary' : 'outline-primary'}
          onClick={() => setMode('list')}
        >
          Lista
        </Button>
        <Button
          variant={mode === 'kanban' ? 'primary' : 'outline-primary'}
          onClick={() => setMode('kanban')}
        >
          Kanban
        </Button>
      </ButtonGroup>
      {mode === 'list' ? (
        <TaskList
          tasks={tasks}
          stories={stories}
          users={users}
          onDetails={setSelectedId}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      ) : (
        <KanbanBoard tasks={tasks} users={users} onOpen={setSelectedId} />
      )}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          project={project}
          story={stories.find((s) => s.id === selectedTask.storyId)}
          users={users}
          onUpdate={handleUpdate}
          onClose={() => setSelectedId(undefined)}
        />
      )}
    </section>
  )
}