import { IBaseService } from "../../services/IBaseService.interface.js";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}


export class UserService implements IBaseService<User> {
  DBurl: string;
  constructor(DBurl: string) {
    this.DBurl = DBurl;
  }

  public async findAll(): Promise<User[]> {
    const response = await fetch(`${this.DBurl}/get/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    return Promise.resolve(data);
  }

  public async findById(id: string): Promise<User> {
    // const user = dbUsers.findById(id);
    // if (!user) {
    //   throw new DBUserNotFoundError(`User with id ${id} not found`);
    // }
    const mockUser: User = {
      username: "sdf",
      age: 1,
      hobbies: [],
      id: id
    };
    // return Promise.resolve({ ...user });
    return Promise.resolve(mockUser);
  }

  public async create(
    userData: { username: string, age: number, hobbies: string[] }
  ): Promise<User> {
    if (!userData.username || typeof userData.age !== "number" || !Array.isArray(userData.hobbies)) {
      throw new Error("Username, age (number), and hobbies (array) are required.");
    }

    try {
      const response = await fetch(`${this.DBurl}/create/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  public async replace(id: string, data: { username: string, age: number, hobbies: string[] }): Promise<User | undefined> {
    if (typeof data.username !== "string" || typeof data.age !== "number" || !Array.isArray(data.hobbies)) {
      throw new Error("Invalid data format for update: username (string), age (number), hobbies (array) are required.");
    }

    return Promise.resolve(undefined);
  }

  public async delete(userId: string): Promise<void> {
    return Promise.resolve();
  }
}
