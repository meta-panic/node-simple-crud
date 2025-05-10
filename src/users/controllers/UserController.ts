import * as http from "node:http";

import { IBaseController } from "../../controllers/BaseController.interface.js";
import { BaseRoute } from "../../controllers/BaseRoute.js";
import { IBaseService } from "../../services/IBaseService.interface.js";
import { User } from "../services/UserService.js";

export class UserController implements IBaseController {
  routers: BaseRoute[];
  userService: IBaseService<User>;

  constructor(userService: IBaseService<User>) {
    this.userService = userService;
    this.routers = [
      new BaseRoute({
        matcher: "/api/users",
        method: "GET",
        execute: this.getAllUsers.bind(this)
      }),
      new BaseRoute({
        matcher: "/api/users/{userId}",
        method: "GET",
        execute: this.getUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/api/users",
        method: "POST",
        execute: this.createUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/api/users/{userId}",
        method: "PUT",
        execute: this.replaceUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/api/users/{userId}",
        method: "DELETE",
        execute: this.deleteUser.bind(this)
      })
    ];
    return this;
  }

  async getAllUsers(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      const users = await this.userService.findAll();
      res.end(JSON.stringify(users));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  getUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }

  async createUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const userData = JSON.parse(body);
          const newUser = await this.userService.create(userData);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error instanceof Error ? error.message : "Invalid request data" }));
        }
      });
    } catch (_error: unknown) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  replaceUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }

  deleteUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {

  }
}
