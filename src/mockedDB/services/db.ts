import { v4 as uuidv4 } from "uuid";

import { DBUser } from "./DBService.js";

export class UserDatabase {
  private users: DBUser[] = [];

  constructor(initialUsers: DBUser[] = []) {
    this.users = [...initialUsers];
  }

  private generateUUID(): string {
    return uuidv4();
  }

  public findAll(): DBUser[] {
    return [...this.users];
  }

  public findById(id: string): DBUser | undefined {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : undefined;
  }

  public create(userData: Omit<DBUser, "id">): DBUser {
    const newUser: DBUser = {
      ...userData,
      id: this.generateUUID()
    };
    this.users.push(newUser);

    return { ...newUser };
  }

  /**
   * Replaces an existing user.
   */
  public replace(id: string, userData: Omit<DBUser, "id">): DBUser | undefined {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    const updatedUser: DBUser = {
      id: id, // Keep the original ID
      username: userData.username,
      age: userData.age,
      hobbies: userData.hobbies
    };
    this.users[userIndex] = updatedUser;

    return { ...updatedUser };
  }

  public delete(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);

    return this.users.length < initialLength; // True if a user was deleted
  }
}
