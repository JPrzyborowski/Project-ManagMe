import type { Priority, StoryState } from '../models/Story'

export const priorityColors: Record<Priority, string> = {
  low: 'secondary',
  medium: 'warning',
  high: 'danger',
}

export const stateColors: Record<StoryState, string> = {
  todo: 'secondary',
  doing: 'primary',
  done: 'success',
}