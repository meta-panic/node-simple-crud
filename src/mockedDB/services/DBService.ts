import { IBaseService } from "../../services/IBaseService.interface.js";
import { UserDatabase } from "./db.js";
import { DBInvalidUserDataError, DBUserNotFoundError } from "./errors.js";

export interface DBUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}


export class DBService implements IBaseService<DBUser> {
  private dbUsers: UserDatabase;

  constructor() {
    this.dbUsers = new UserDatabase();
  }
  public async findAll(): Promise<DBUser[]> {
    return Promise.resolve(this.dbUsers.findAll());
  }

  public async findById(id: string): Promise<DBUser> {
    const user = this.dbUsers.findById(id);
    if (!user) {
      throw new DBUserNotFoundError(`User with id ${id} not found`);
    }

    return Promise.resolve({ ...user });
  }

  public async create(
    userData: { username: string, age: number, hobbies: string[] }
  ): Promise<DBUser> {
    if (!userData.username || typeof userData.age !== "number" || !Array.isArray(userData.hobbies)) {
      throw new DBInvalidUserDataError("Username, age (number), and hobbies (array) are required.");
    }

    const newUser: Omit<DBUser, "id"> = {
      username: userData.username,
      age: userData.age,
      hobbies: userData.hobbies
    };

    return Promise.resolve({ ...this.dbUsers.create(newUser) });
  }

  public async replace(id: string, data: { username: string, age: number, hobbies: string[] }): Promise<DBUser | undefined> {
    if (typeof data.username !== "string" || typeof data.age !== "number" || !Array.isArray(data.hobbies)) {
      throw new DBInvalidUserDataError("Invalid data format for update: username (string), age (number), hobbies (array) are required.");
    }

    const perlacedUser = this.dbUsers.replace(id, data);
    return Promise.resolve(perlacedUser ? { ...perlacedUser } : undefined);
  }

  public async delete(userId: string): Promise<void> {
    if (this.dbUsers.delete(userId)) {
      throw new DBUserNotFoundError(`User with id ${userId} not found for deletion`);
    }

    return Promise.resolve();
  }
}
