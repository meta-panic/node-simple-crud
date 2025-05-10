import * as http from "node:http";
import { v4 as uuidv4 } from "uuid";

import { IBaseController } from "../../controllers/BaseController.interface.js";
import { BaseRoute } from "../../controllers/BaseRoute.js";
import { getUserIdFromUrl, parseJSONBody } from "../../controllers/utils.js";
import { DBService, DBUser } from "../services/DBService.js";

export class DBController implements IBaseController {
  routers: BaseRoute[];
  DBService: DBService;

  constructor(DBService: DBService) {
    this.DBService = DBService;
    this.routers = [
      new BaseRoute({
        matcher: "/get/users",
        method: "GET",
        execute: this.getAllUsers.bind(this)
      }),
      new BaseRoute({
        matcher: "/get/user/{userId}",
        method: "GET",
        execute: this.getUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/create/users",
        method: "POST",
        execute: this.createUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/replace/users/{userId}",
        method: "PUT",
        execute: this.replaceUser.bind(this)
      }),
      new BaseRoute({
        matcher: "/delete/users/{userId}",
        method: "DELETE",
        execute: this.deleteUser.bind(this)
      })
    ];
  }

  // TODO: add decorators for error handling
  async getAllUsers(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      const users = JSON.stringify(await this.DBService.findAll());
      res.end(users);
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  async getUser(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const userId = getUserIdFromUrl(req.url);
      if (!userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User ID is missing or invalid in URL" }));
        return;
      }
      const user = this.DBService.findById(userId);

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `User with id ${userId} not found` }));
      }
    } catch (error) {
      console.error("Error in getUser:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  async createUser(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const { username, age, hobbies } = await parseJSONBody<{ username: string, age: number, hobbies: string[] }>(req);

      if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Missing required fields (username, age, hobbies) or invalid types" }));
        return;
      }

      const newUser: DBUser = {
        id: uuidv4(),
        username,
        age,
        hobbies
      };
      this.DBService.create(newUser);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      console.error("Error in createUser:", error);

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  async replaceUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      const userId = getUserIdFromUrl(req.url);
      if (!userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User ID is missing or invalid in URL" }));
        return;
      }


      const user = await this.DBService.findById(userId);

      if (user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `User with id ${userId} not found` }));
        return;
      }

      const { username, age, hobbies } = await parseJSONBody<{ username: string, age: number, hobbies: string[] }>(req);

      if (typeof username !== "string" || typeof age !== "number" || !Array.isArray(hobbies)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid data format: username (string), age (number), hobbies (array) are required." }));
        return;
      }

      const updatedUser = this.DBService.replace(userId, { username, age, hobbies });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error in replaceUser:", error);

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }

  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    try {
      const userId = getUserIdFromUrl(req.url);
      if (!userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User ID is missing or invalid in URL" }));
        return;
      }

      await this.DBService.delete(userId);

      res.writeHead(204, { "Content-Type": "application/json" });
      res.end();
    } catch (error) {
      console.error("Error in deleteUser:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }
}
