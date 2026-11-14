import type { NewProject, Project } from '../models/Project'
import type { NewStory, Story } from '../models/Story'
import type { Task, TaskFormData } from '../models/Task'

export class ApiService {
  private readonly projectsKey = 'managme:projects'
  private readonly storiesKey = 'managme:stories'
    private readonly tasksKey = 'managme:tasks'
  private readonly activeProjectKey = 'managme:activeProjectId'

  private read<T>(key: string): T[] {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  }

  private write<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items))
  }

  async getProjects(): Promise<Project[]> {
    return this.read<Project>(this.projectsKey)
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.read<Project>(this.projectsKey).find((p) => p.id === id)
  }

  async createProject(data: NewProject): Promise<Project> {
    const project: Project = { id: crypto.randomUUID(), ...data }
    this.write(this.projectsKey, [...this.read<Project>(this.projectsKey), project])
    return project
  }

  async updateProject(project: Project): Promise<void> {
    this.write(
      this.projectsKey,
      this.read<Project>(this.projectsKey).map((p) => (p.id === project.id ? project : p)),
    )
  }

  async deleteProject(id: string): Promise<void> {

        const stories = this.read<Story>(this.storiesKey)
    const storyIds = new Set(stories.filter((s) => s.projectId === id).map((s) => s.id))

    this.write(
      this.projectsKey,
      this.read<Project>(this.projectsKey).filter((p) => p.id !== id),
    )
    this.write(
      this.storiesKey,
      this.read<Story>(this.storiesKey).filter((s) => s.projectId !== id),
    )
    this.write(
      this.tasksKey,
      this.read<Task>(this.tasksKey).filter((t) => !storyIds.has(t.storyId)),
    )
    if (localStorage.getItem(this.activeProjectKey) === id) {
      localStorage.removeItem(this.activeProjectKey)
    }
  }

  async getActiveProjectId(): Promise<string | undefined> {
    return localStorage.getItem(this.activeProjectKey) ?? undefined
  }

  async setActiveProjectId(id: string): Promise<void> {
    localStorage.setItem(this.activeProjectKey, id)
  }

  async clearActiveProjectId(): Promise<void> {
    localStorage.removeItem(this.activeProjectKey)
  }

  async getStoriesByProject(projectId: string): Promise<Story[]> {
    return this.read<Story>(this.storiesKey).filter((s) => s.projectId === projectId)
  }

  async createStory(data: NewStory): Promise<Story> {
    const story: Story = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.write(this.storiesKey, [...this.read<Story>(this.storiesKey), story])
    return story
  }

  async updateStory(story: Story): Promise<void> {
    this.write(
      this.storiesKey,
      this.read<Story>(this.storiesKey).map((s) => (s.id === story.id ? story : s)),
    )
  }

  async deleteStory(id: string): Promise<void> {
    this.write(
      this.storiesKey,
      this.read<Story>(this.storiesKey).filter((s) => s.id !== id),
    )
    this.write(
      this.tasksKey,
      this.read<Task>(this.tasksKey).filter((t) => t.storyId !== id),
    )
  }


  async getTaskByProject(projectId: string): Promise<Task[]> {
      const storyIds = new Set(
        this.read<Story>(this.storiesKey)
          .filter((s) => s.projectId === projectId)
          .map((s) => s.id),
      )
      return this.read<Task>(this.tasksKey).filter((t) => storyIds.has(t.storyId))  
    }
   
async createTask(data: TaskFormData): Promise<Task> {
      const task: Task = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        state: 'todo',
        workedHours: 0,
        ...data,
      }
      this.write(this.tasksKey, [...this.read<Task>(this.tasksKey), task])
      return task
    }

    async updateTask(task: Task): Promise<void> {
      this.write(
        this.tasksKey,
        this.read<Task>(this.tasksKey).map((t) => (t.id === task.id ? task : t)),
      )
    }

    async deleteTask(id: string): Promise<void> {
      this.write(
        this.tasksKey,
        this.read<Task>(this.tasksKey).filter((t) => t.id !== id),
      )
    }

  }

export const api = new ApiService()