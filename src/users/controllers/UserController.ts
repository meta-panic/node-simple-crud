import * as http from "node:http";

import { IBaseController } from "../../controllers/BaseController.interface.js";
import { BaseRoute } from "../../controllers/BaseRoute.js";
import { IBaseService } from "../../services/IBaseService.interface.js";
import { User } from "../services/UserService.js";
import { responceOnError } from "../../decorators/errorHandler.js";
import { getUserIdFromUrlIfValid } from "../../controllers/utils.js";
import { ControllerError } from "../../controllers/errors.js";

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

  @responceOnError({ errorCode: 500, errorMessage: "Failed to fetch users" })
  async getAllUsers(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const users = await this.userService.findAll();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  }

  @responceOnError({ errorCode: 404, errorMessage: "User not found" })
  async getUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const uuid = getUserIdFromUrlIfValid(req.url);
    if (!uuid) {
      throw new ControllerError({ message: "Incorrect or missing id", errorCode: 400 });
    }

    const userId = await this.userService.findById(uuid);
    if (!userId) {
      throw new Error("User ID is required");
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userId));
  }

  @responceOnError({ errorCode: 400, errorMessage: "Invalid request data" })
  async createUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", chunk => {
        data += chunk.toString();
      });
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const userData = JSON.parse(body);
    const newUser = await this.userService.create(userData);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  }

  @responceOnError({ errorCode: 400, errorMessage: "Invalid request data" })
  async replaceUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", chunk => {
        data += chunk.toString();
      });
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const uuid = getUserIdFromUrlIfValid(req.url);
    if (!uuid) {
      throw new ControllerError({ message: "Not uuid: Incorrect or missing id", errorCode: 400 });
    }

    const updatedUser = await this.userService.replace(uuid, JSON.parse(body));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
  }

  @responceOnError({ errorCode: 400, errorMessage: "Invalid request data" })
  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
    const uuid = getUserIdFromUrlIfValid(req.url);
    if (!uuid) {
      throw new ControllerError({ message: "Not uuid: Incorrect or missing id", errorCode: 400 });
    }

    await this.userService.delete(uuid);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(`User with ${uuid} id were deleted`);
  }
}
