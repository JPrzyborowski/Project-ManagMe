export type Role = 'admin' | 'devops' | 'developer'

export type User = {
  id: string
  firstName: string
  lastName: string
  role: Role
}

export const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  devops: 'DevOps',
  developer: 'Developer',
}

export function fullName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
