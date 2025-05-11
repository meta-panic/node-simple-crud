import "dotenv/config";
import cluster, { Worker } from "node:cluster";
import os from "node:os";

import { ILoadBalancer } from "./LoadBalancer.interface.js";


export class RoundRobinBalancer implements ILoadBalancer {
  balancerPort: number;
  numCPUs: number;
  workerPorts: Map<number, number>;
  private currentWorkerIndex: number;

  constructor({ balancerPort = 5000 }) {
    this.balancerPort = balancerPort;
    this.numCPUs = os.cpus().length;
    this.workerPorts = new Map<number, number>();
    this.currentWorkerIndex = 0;
  }

  createWorkers() {
    for (let i = 1; i <= this.numCPUs; i++) {
      const assignedPort = this.balancerPort + i;
      const workerEnv = { WORKER_PORT: assignedPort.toString() };

      const worker: Worker = cluster.fork(workerEnv);
      this.workerPorts.set(worker.id, assignedPort);

      console.log(`Worker ${worker.process.pid} (ID: ${worker.id}) started on port ${assignedPort}`);
    }

    cluster.on("exit", (worker: Worker, code: number, signal: string) => {
      const deadWorkerPort = this.getWorkerPort(worker.id);

      if (deadWorkerPort !== undefined) {
        console.log(
          `Worker ${worker.process.pid} (ID: ${worker.id}) on port ${deadWorkerPort} died. Code: ${code}, Signal: ${signal}. Restarting on the same port...`
        );

        this.deleteWorker(worker.id);

        const newWorkerEnv = { WORKER_PORT: deadWorkerPort.toString() };
        const newWorker: Worker = cluster.fork(newWorkerEnv);

        this.addWorker(newWorker.id, deadWorkerPort);
        console.log(`Re-forked new worker ${newWorker.process.pid} (ID: ${newWorker.id}) on port ${deadWorkerPort}`);
      } else {
        console.error(
          `Worker ${worker.process.pid} (ID: ${worker.id}) died, but its port was not found. Cannot restart on specific port.`
        );
      }
    });
  }

  private getWorkerPort(workerId: number): number | undefined {
    return this.workerPorts.get(workerId);
  }

  private deleteWorker(workerId: number): boolean {
    return this.workerPorts.delete(workerId);
  }

  private addWorker(id: number, port: number): void {
    this.workerPorts.set(id, port);
  }

  getNextWorkerPort(): number | undefined {
    const availablePorts = Array.from(this.workerPorts.values());

    if (availablePorts.length === 0) {
      console.warn("getNextWorkerPort called, but no workers are available.");
      return;
    }

    const nextPort = availablePorts[this.currentWorkerIndex];
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % availablePorts.length;

    return nextPort;
  }
}
