export interface ILoadBalancer {
  balancerPort: number;
  numCPUs: number;
  workerPorts: ReadonlyMap<number, number>;

  createWorkers(): void;

  getNextWorkerPort(): number | undefined;
}
