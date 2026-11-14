import type { Priority, StoryState } from './Story'

export type TaskState = StoryState

export type Task = {
  id: string
  name: string
  description: string
  priority: Priority
  storyId: string
  estimatedHours: number
  workedHours: number
  state: TaskState
  createdAt: string
  startedAt?: string
  finishedAt?: string
  assigneeId?: string
}

export type TaskFormData = Pick<
  Task,
  'name' | 'description' | 'priority' | 'storyId' | 'estimatedHours'
>