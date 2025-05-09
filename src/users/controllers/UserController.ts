import * as http from "node:http";

import { IUserController } from "./UserController.interface.js";
import { BaseRoute } from "./BaseRoute.js";

export class UserController implements IUserController {
  routers: BaseRoute[];

  constructor() {
    this.routers = [
      new BaseRoute({
        matcher: '/api/users',
        method: 'GET',
        execute: this.getAllUsers
      }),
      new BaseRoute({
        matcher: 'api/users/{userId}',
        method: 'GET',
        execute: this.getUser
      }),
      new BaseRoute({
        matcher: 'api/users',
        method: 'POST',
        execute: this.createUser
      }),
      new BaseRoute({
        matcher: 'api/users/{userId}',
        method: 'PUT',
        execute: this.replaceUser
      }),
      new BaseRoute({
        matcher: 'api/users/{userId}',
        method: 'DELETE',
        execute: this.deleteUser
      }),
    ]
  }

  async getAllUsers(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      console.log("getAllUsers")
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end("gamarjoba!");
    } catch (error) {
      console.log(error)
    }
  }

  getUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }

  createUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }

  replaceUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }

  deleteUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }
}