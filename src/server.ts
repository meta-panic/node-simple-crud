import * as http from "node:http";

import { IRoute } from "./controllers/Route.interface.js";
import { injectRoutes } from "./controllers/utils.js";


export class App {
  private server?: http.Server;
  private routes?: IRoute[];
  private DBserver?: http.Server;

  registerRoutes(routes: IRoute[]): this {
    this.routes = routes;

    return this;
  }

  setDB(dbServer: http.Server): this {
    this.DBserver = dbServer;

    return this;
  }

  startDB(PORT: string): this {
    if (!this.DBserver) {
      throw new Error("No DB were initialized.");
    }

    this.DBserver.listen(PORT, () => console.info(`Db server running on port ${PORT}...`));

    return this;
  }

  startServer(port?: string): http.Server {
    this.server = http.createServer((req, res) => {
      console.log(`[PID: ${process.pid}] Handling request: ${req.method} ${req.url}`);
      if (this.routes?.length) {
        injectRoutes(this.routes, req, res);
      };
    });

    const MAIN_PORT = port || process.env.MAIN_PORT;

    this.server.listen(MAIN_PORT, () => console.info(`Server running on port ${MAIN_PORT}...`));

    return this.server;
  }
}
