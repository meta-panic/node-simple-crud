import "dotenv/config";

import { App } from "./server.js";
import { UserController } from "./users/controllers/UserController.js";
import { mockDBService } from "./mockedDB/mockDBService.js";
import { UserService } from "./users/services/UserService.js";


const dbService = mockDBService();
const DB_PORT: string | undefined = process.env.DB_PORT || "1234";

const userService = new UserService(`http://localhost:${DB_PORT}`);
const userController = new UserController(userService);

new App()
  .registerRoutes(userController.routers)
  .initDB(dbService, DB_PORT) // TODO: rename method
  .startServer();
