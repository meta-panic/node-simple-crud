import * as http from "node:http";

import { IBaseController } from "../../controllers/BaseController.interface";
import { BaseRoute } from "../../controllers/BaseRoute";
import { getUserIdFromUrl, parseJSONBody } from "../../controllers/utils";
import { DBService } from "../services/DBService";
import { responceOnError } from "../../decorators/errorHandler";
import { ServerError } from "../../controllers/errors";

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
        matcher: "/get/users/{userId}",
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

  @responceOnError({ errorCode: 500, errorMessage: "Internal Server Error" })
  async getAllUsers(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const users = JSON.stringify(await this.DBService.findAll());

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(users);
  }

  @responceOnError({ errorCode: 500, errorMessage: "Internal Server Error" })
  async getUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const userId = getUserIdFromUrl(req.url);
    if (!userId) {
      throw new ServerError({ errorCode: 400, message: "User ID is missing or invalid in URL" });
    }

    const user = await this.DBService.findById(userId);
    if (!user) {
      throw new ServerError({ errorCode: 404, message: `User with id ${userId} not found` });
    }


    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  }

  @responceOnError({ errorCode: 500, errorMessage: "Internal Server Error" })
  async createUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const { username, age, hobbies } = await parseJSONBody<{ username: string, age: number, hobbies: string[] }>(req);

    if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
      throw new ServerError({ errorCode: 400, message: "Missing required fields (username, age, hobbies) or invalid types}" });
    }

    const createdUser = await this.DBService.create({ username, age, hobbies });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(createdUser));
  }

  @responceOnError({ errorCode: 500, errorMessage: "Internal Server Error" })
  async replaceUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const { username, age, hobbies } = await parseJSONBody<{ username: string, age: number, hobbies: string[] }>(req);

    if (typeof username !== "string" || typeof age !== "number" || !Array.isArray(hobbies)) {
      throw new ServerError({ errorCode: 400, message: "Invalid data format: username (string), age (number), hobbies (array) are required." });
    }

    const userId = getUserIdFromUrl(req.url);
    if (!userId) {
      throw new ServerError({ errorCode: 400, message: "User ID is missing or invalid in URL" });
    }

    const user = await this.DBService.findById(userId);
    if (!user) {
      throw new ServerError({ errorCode: 404, message: `User with id ${userId} not found` });
    }

    const updatedUser = await this.DBService.replace(userId, { username, age, hobbies });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
  }

  @responceOnError({ errorCode: 500, errorMessage: "Internal Server Error" })
  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const userId = getUserIdFromUrl(req.url);
    if (!userId) {
      throw new ServerError({ errorCode: 400, message: "Invalid uuid" });
    }

    await this.DBService.delete(userId);

    res.writeHead(204, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `User with id ${userId} were deleted` }));
  }
}
