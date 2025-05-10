import * as http from "node:http";

import { injectRoutes } from "../controllers/utils.js";
import { DBController } from "./controllers/DBController.js";
import { DBService } from "./services/DBService.js";


export function mockDBService() {
  const dbController = new DBController(new DBService()).routers;
  const server = http.createServer((req, res) => {
    injectRoutes(dbController, req, res);
  });

  return server;
}
