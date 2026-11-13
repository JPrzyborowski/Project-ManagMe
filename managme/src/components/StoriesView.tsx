import { useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { api } from '../api/ApiService'
import type { Project } from '../models/Project'
import { stateLabels, type Story, type StoryFormData, type StoryState } from '../models/Story'
import type { User } from '../models/User'
import { StoryForm } from './StoryForm'
import { StoryList } from './StoryList'

type Props = {
  project: Project
  user: User
}

type Filter = StoryState | 'all'

export function StoriesView({ project, user }: Props) {
  const [stories, setStories] = useState<Story[]>([])
  const [editing, setEditing] = useState<Story | undefined>()
  const [filter, setFilter] = useState<Filter>('all')

  async function reload() {
    setStories(await api.getStoriesByProject(project.id))
  }

  useEffect(() => {
    let cancelled = false

    api.getStoriesByProject(project.id).then((data) => {
      if (!cancelled) setStories(data)
    })

    return () => {
      cancelled = true
    }
  }, [project.id])

  async function handleSubmit(data: StoryFormData) {
    if (editing) {
      await api.updateStory({ ...editing, ...data })
      setEditing(undefined)
    } else {
      await api.createStory({ ...data, projectId: project.id, ownerId: user.id })
    }
    await reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Na pewno usunąć historyjkę?')) return
    await api.deleteStory(id)
    if (editing?.id === id) setEditing(undefined)
    await reload()
  }

  const visibleStories = filter === 'all' ? stories : stories.filter((s) => s.state === filter)
  const filters: Filter[] = ['all', 'todo', 'doing', 'done']

  return (
    <section>
      <h2 className="h4">Historyjki projektu: {project.name}</h2>
      <h3 className="h5">{editing ? 'Edycja historyjki' : 'Nowa historyjka'}</h3>
      <StoryForm
        key={editing?.id ?? 'new'}
        initial={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(undefined)}
      />
      <ButtonGroup className="mb-3">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline-primary'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Wszystkie' : stateLabels[f]}
          </Button>
        ))}
      </ButtonGroup>
      <StoryList stories={visibleStories} onEdit={setEditing} onDelete={handleDelete} />
    </section>
  )
}