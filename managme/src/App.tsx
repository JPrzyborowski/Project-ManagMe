import { useEffect, useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { api } from './api/ApiService'
import { userService } from './api/UserService'
import { ProjectForm } from './components/ProjectForm'
import { ProjectList } from './components/ProjectList'
import { ProjectView } from './components/ProjectView'
import type { NewProject, Project } from './models/Project'
import { fullName, roleLabels } from './models/User'

export default function App() {
  const user = userService.getLoggedUser()
  const users = userService.getAll()
  const [loaded, setLoaded] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeId, setActiveId] = useState<string | undefined>()
  const [editing, setEditing] = useState<Project | undefined>()

  async function reload() {
    setProjects(await api.getProjects())
    setActiveId(await api.getActiveProjectId())
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([api.getProjects(), api.getActiveProjectId()]).then(([allProjects, active]) => {
      if (cancelled) return
      setProjects(allProjects)
      setActiveId(active)
      setLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(data: NewProject) {
    if (editing) {
      await api.updateProject({ ...editing, ...data })
      setEditing(undefined)
    } else {
      await api.createProject(data)
    }
    await reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Na pewno usunąć projekt razem z jego historyjkami i zadaniami?')) return
    await api.deleteProject(id)
    if (editing?.id === id) setEditing(undefined)
    await reload()
  }

  async function handleSelect(id: string) {
    await api.setActiveProjectId(id)
    setActiveId(id)
    setEditing(undefined)
  }

  async function handleChangeProject() {
    await api.clearActiveProjectId()
    setActiveId(undefined)
    setEditing(undefined)
  }

  const activeProject = projects.find((p) => p.id === activeId)

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
        <Container>
          <Navbar.Brand>ManagMe</Navbar.Brand>
          <Navbar.Text>
            Zalogowany: {fullName(user)} ({roleLabels[user.role]})
          </Navbar.Text>
        </Container>
      </Navbar>
      {loaded && (
        <Container className="pb-5">
          {activeProject ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-muted">Aktywny projekt:</span>{' '}
                  <strong>{activeProject.name}</strong>
                </div>
                <Button variant="outline-primary" onClick={handleChangeProject}>
                  Zmień projekt
                </Button>
              </div>
              <ProjectView key={activeProject.id} project={activeProject} user={user} users={users} />
            </>
          ) : (
            <>
              <h2 className="h4">{editing ? 'Edycja projektu' : 'Nowy projekt'}</h2>
              <ProjectForm
                key={editing?.id ?? 'new'}
                initial={editing}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(undefined)}
              />
              <h2 className="h4">Wybierz projekt</h2>
              <ProjectList
                projects={projects}
                onSelect={handleSelect}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            </>
          )}
        </Container>
      )}
    </>
  )
}