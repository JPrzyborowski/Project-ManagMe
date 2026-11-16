
import { useEffect, useState } from 'react'
import { Alert, Button, Container, Navbar } from 'react-bootstrap'
import { api } from './api/ApiService'
import { userService } from './api/UserService'
import { LoginForm } from './components/LoginForm'
import { ProjectForm } from './components/ProjectForm'
import { ProjectList } from './components/ProjectList'
import { ProjectView } from './components/ProjectView'
import type { NewProject, Project } from './models/Project'
import type { User } from './models/User'
import { fullName, roleLabels } from './models/User'

type LoginResponse = {
  token: string
  refreshToken: string
  user: {
    id: string
    login: string
    role: 'admin' | 'devops' | 'developer'
  }
}

export default function App() {
  const users = userService.getAll()

  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loginError, setLoginError] = useState('')

  const [loaded, setLoaded] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeId, setActiveId] = useState<string | undefined>()
  const [editing, setEditing] = useState<Project | undefined>()

  async function reload() {
    setProjects(await api.getProjects())
    setActiveId(await api.getActiveProjectId())
  }

  useEffect(() => {
    if (!user) return

    let cancelled = false

    Promise.all([
      api.getProjects(),
      api.getActiveProjectId(),
    ]).then(([allProjects, active]) => {
      if (cancelled) return

      setProjects(allProjects)
      setActiveId(active)
      setLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [user])

  function handleLogin(data: LoginResponse) {
    const matchedUser = userService.getById(data.user.id)

    if (!matchedUser || matchedUser.role !== data.user.role) {
      setLoginError('Nie znaleziono zgodnego użytkownika w aplikacji')
      return
    }

    setAccessToken(data.token)
    setRefreshToken(data.refreshToken)
    setUser(matchedUser)
    setLoginError('')
    setLoaded(false)
  }

  function handleLogout() {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    setProjects([])
    setActiveId(undefined)
    setEditing(undefined)
    setLoaded(false)
  }

  

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

    if (editing?.id === id) {
      setEditing(undefined)
    }

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

  if (!user) {
    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
          <Container>
            <Navbar.Brand>ManagMe</Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="py-5">
          {loginError && (
            <Alert variant="danger" className="mx-auto" style={{ maxWidth: 400 }}>
              {loginError}
            </Alert>
          )}
          <LoginForm onLogin={handleLogin} />
        </Container>
      </>
    )
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
        <Container>
          <Navbar.Brand>ManagMe</Navbar.Brand>

          <div className="d-flex align-items-center gap-3">
            <Navbar.Text>
              Zalogowany: {fullName(user)} ({roleLabels[user.role]})
            </Navbar.Text>

            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
            >
              Wyloguj
            </Button>
          </div>
        </Container>
      </Navbar>

      {loaded && accessToken && refreshToken && (
        <Container className="pb-5">
          {activeProject ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-muted">Aktywny projekt:</span>{' '}
                  <strong>{activeProject.name}</strong>
                </div>

                <Button
                  variant="outline-primary"
                  onClick={handleChangeProject}
                >
                  Zmień projekt
                </Button>
              </div>

              <ProjectView
                key={activeProject.id}
                project={activeProject}
                user={user}
                users={users}
              />
            </>
          ) : (
            <>
              <h2 className="h4">
                {editing ? 'Edycja projektu' : 'Nowy projekt'}
              </h2>

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
