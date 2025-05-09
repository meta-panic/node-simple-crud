import 'dotenv/config';

import { App } from "./server.js";
import { UserController } from "./users/controllers/UserController.js";


new App()
  .registerRoutes(new UserController().routers)
  .startServer();

