import type { Task } from '../models/Task'
import type { User } from '../models/User'

export function canBeAssigned(user: User): boolean {
  return user.role === 'devops' || user.role === 'developer'
}

export function assignUser(task: Task, user: User): Task {
  if (task.state === 'done' || !canBeAssigned(user)) return task

  if (task.state === 'todo') {
    return {
      ...task,
      assigneeId: user.id,
      state: 'doing',
      startedAt: new Date().toISOString(),
    }
  }

  return { ...task, assigneeId: user.id }
}

export function finishTask(task: Task): Task {
  if (task.state !== 'doing' || !task.assigneeId) return task

  return {
    ...task,
    state: 'done',
    finishedAt: new Date().toISOString(),
  }
}