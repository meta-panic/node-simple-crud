import { validate as IsUuidValid } from "uuid";

import { ServerError } from "../../controllers/errors";
import { IBaseService } from "../../services/IBaseService.interface";

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new ServerError({
        message: errorData.message || `Failed to find all users: ${response.statusText}`,
        errorCode: response.status,
        cause: errorData.cause
      });
    }
    const data = await response.json();

    return Promise.resolve(data);
  }

  public async findById(id: string): Promise<User> {
    if (!IsUuidValid(id)) {
      throw new ServerError({ message: "Invalid user ID format. Expected UUID v4", errorCode: 400 });
    }

    const response = await fetch(`${this.DBurl}/get/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ServerError({
        message: errorData.message || `Failed to find user by id: ${response.statusText}`,
        errorCode: response.status,
        cause: errorData.cause
      });
    }

    if (!response) {
      throw new ServerError({ message: `User with id ${id} not found`, errorCode: 500 });
    }

    return await response.json();
  }

  public async create(
    userData: { username: string, age: number, hobbies: string[] }
  ): Promise<User> {
    if (!userData.username || typeof userData.age !== "number" || !Array.isArray(userData.hobbies)) {
      throw new ServerError({ message: "Username, age (number), and hobbies (array) are required.", errorCode: 400 });
    }

    const response = await fetch(`${this.DBurl}/create/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ServerError({
        message: errorData.message || `Failed to create user: ${response.statusText}`,
        errorCode: response.status,
        cause: errorData.cause
      });
    }

    const newUser = await response.json();
    return newUser;
  }

  public async replace(id: string, data: { username: string, age: number, hobbies: string[] }): Promise<User> {
    if (typeof data.username !== "string" || typeof data.age !== "number" || !Array.isArray(data.hobbies)) {
      throw new ServerError({ message: "Invalid data format for update: username (string), age (number), hobbies (array) are required.", errorCode: 400 });
    }

    if (!IsUuidValid(id)) {
      throw new ServerError({ message: "Invalid user ID format. Expected UUID v4", errorCode: 400 });
    }

    const response = await fetch(`${this.DBurl}/replace/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ServerError({
        message: errorData.message || `Failed to replace user: ${response.statusText}`,
        errorCode: response.status,
        cause: errorData.cause
      });
    }

    const updatedUser = await response.json();
    return updatedUser;
  }

  public async delete(userId: string): Promise<void> {
    if (!IsUuidValid(userId)) {
      throw new ServerError({ message: "Invalid user ID format. Expected UUID v4", errorCode: 400 });
    }

    const response = await fetch(`${this.DBurl}/delete/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ServerError({
        message: errorData.message || `Failed to delete user: ${response.statusText}`,
        errorCode: response.status,
        cause: errorData.cause
      });
    }

    return Promise.resolve();
  }
}
