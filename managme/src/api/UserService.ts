import type { User } from '../models/User'

export class UserService {
  private readonly loggedUser: User = {
    id: 'user-1',
    firstName: 'Jan',
    lastName: 'Kowalski',
  }

  getLoggedUser(): User {
    return this.loggedUser
  }
}

export const userService = new UserService()