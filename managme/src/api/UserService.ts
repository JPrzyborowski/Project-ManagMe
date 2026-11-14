import type { User } from '../models/User'



export class UserService {

  private readonly loggedUserId = 'user-1'  
  private readonly users: User[] = [
     { id: 'user-1', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
    { id: 'user-2', firstName: 'Anna', lastName: 'Nowak', role: 'devops' },
    { id: 'user-3', firstName: 'Piotr', lastName: 'Wiśniewski', role: 'developer' },
    { id: 'user-4', firstName: 'Katarzyna', lastName: 'Zielińska', role: 'developer' },
  ]


  getLoggedUser(): User {
    const user = this.users.find((u) => u.id === this.loggedUserId) 
    if (!user) { 
      throw new Error('Zalgoowany uzytkownik nie istnieje')
    }
    return user
  }

  getAll(): User[] {
    return this.users
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }
}






export const userService = new UserService()