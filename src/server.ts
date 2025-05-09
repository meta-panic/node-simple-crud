import * as http from "node:http";
import { IRoute } from "./users/controllers/route.interface.js";


export class App {
  private server?: http.Server;
  private routes?: IRoute[];

  registerRoutes(routes: IRoute[]): this {
    this.routes = routes;
    return this;
  }

  startServer(): void {
    this.server = http.createServer((req, res) => {
      const hasRoute = this.routes?.some((route) => {
        if (route.match(req.url, req.method)) {
          route.execute(req, res);
          return true;
        }
      });

      if (!hasRoute) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Route Not Found: Please use the api/products endpoint',
          })
        );
      }
    });

    const PORT = process.env.MAIN_PORT;

    console.log("PORT - ", PORT)
    this.server.listen(PORT, () => console.info(`Server running on port ${PORT}`));
  }
}
