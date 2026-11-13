export type Priority = 'low' | 'medium' | 'high'

export type StoryState = 'todo' | 'doing' | 'done'

export type Story = {
  id: string
  name: string
  description: string
  priority: Priority
  projectId: string
  createdAt: string
  state: StoryState
  ownerId: string
}

export type StoryFormData = Pick<Story, 'name' | 'description' | 'priority' | 'state'>

export type NewStory = Omit<Story, 'id' | 'createdAt'>

export const priorityLabels: Record<Priority, string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
}

export const stateLabels: Record<StoryState, string> = {
  todo: 'Do zrobienia',
  doing: 'W trakcie',
  done: 'Zrobione',
}