import "dotenv/config";

import { App } from "./server";
import { UserController } from "./users/controllers/UserController";
import { mockDBService } from "./mockedDB/mockDBService";
import { UserService } from "./users/services/UserService";


const dbService = mockDBService();
const DB_PORT: string | undefined = process.env.DB_PORT || "1234";

const userService = new UserService(`http://localhost:${DB_PORT}`);
const userController = new UserController(userService);

new App()
  .registerRoutes(userController.routers)
  .setDB(dbService)
  .startDB(DB_PORT) // TODO: rename method
  .startServer();
