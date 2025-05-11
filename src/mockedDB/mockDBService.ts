import * as http from "node:http";

import { injectRoutes } from "../controllers/utils";
import { DBController } from "./controllers/DBController";
import { DBService } from "./services/DBService";


export function mockDBService() {
  const dbController = new DBController(new DBService()).routers;
  const server = http.createServer((req, res) => {
    injectRoutes(dbController, req, res);
  });

  return server;
}
