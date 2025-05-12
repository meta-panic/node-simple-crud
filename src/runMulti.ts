import "dotenv/config";
import cluster from "node:cluster";

import { App } from "./server";
import { UserController } from "./users/controllers/UserController";
import { mockDBService } from "./mockedDB/mockDBService";
import { UserService } from "./users/services/UserService";
import { RoundRobinBalancer } from "./cluster/RoundRobinBalancer";
import { ProxyServer } from "./cluster/ProxyServer";

// Init one instance of DB
let dbService = mockDBService();
let DB_PORT: string | undefined = process.env.DB_PORT || "1234";
const targetHostname = "localhost";

if (cluster.isPrimary) {
  initDB();
  runMain();
} else if (cluster.isWorker) {
  runWorker();
}

function initDB() {
  dbService = mockDBService();
  DB_PORT = process.env.DB_PORT || "1234";
  dbService.listen(DB_PORT, () => console.info(`Db server running on port ${DB_PORT}...`));
}

function runMain() {
  console.log(`Primary process ${process.pid} is running.`);

  const loadBalancerPort = Number(process.env.MAIN_PORT) || 5000;
  const loadBalancer = new RoundRobinBalancer({ balancerPort: loadBalancerPort });
  loadBalancer.createWorkers();

  new ProxyServer(
    {
      port: loadBalancerPort,
      targetHostname: targetHostname,
      loadBalancer: loadBalancer
    });
}


function runWorker() {
  const workerPort = process.env.WORKER_PORT;
  console.log(`Worker ${process.pid} started, reporting for duty on port ${workerPort}.`);
  const userService = new UserService(`http://${targetHostname}:${DB_PORT}`);
  const userController = new UserController(userService);

  new App()
    .registerRoutes(userController.routers)
    .setDB(dbService)
    .startServer(workerPort);
}
