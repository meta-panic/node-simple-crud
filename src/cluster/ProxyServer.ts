import "dotenv/config";
import * as http from "node:http";
import { ILoadBalancer } from "./LoadBalancer.interface";


interface ProxyServerConstructor { port: number, targetHostname: string, loadBalancer: ILoadBalancer };

export class ProxyServer {
  server: http.Server;
  port: number;
  loadBalancer: ILoadBalancer;

  constructor({ port, targetHostname, loadBalancer }: ProxyServerConstructor) {
    this.port = port;
    this.loadBalancer = loadBalancer;

    this.server = http.createServer((clientReq, clientRes) => {
      const nextWorkerPort = this.loadBalancer.getNextWorkerPort();
      console.log(`Received request from ${clientReq.url}. Sent to ${nextWorkerPort}`);

      const options = {
        hostname: targetHostname,
        port: nextWorkerPort,
        path: clientReq.url,
        method: clientReq.method,
        headers: {
          ...clientReq.headers,
          host: targetHostname
        }
      };

      // Sent the request to a worker and pipe the responce to the client responce
      const proxyReq = http.request(options, (targetRes) => {
        clientRes.writeHead(targetRes.statusCode || 500, targetRes.headers);
        targetRes.pipe(clientRes, { end: true });
      });

      proxyReq.on("error", (err) => {
        console.error(`Error during request to target service: ${err.message}`);
        if (!clientRes.headersSent) {
          clientRes.writeHead(502, { "Content-Type": "application/json" }); // 502 Bad Gateway
        }
        clientRes.end(JSON.stringify({ error: "Proxy error", details: err.message }));
      });

      clientReq.pipe(proxyReq, { end: true });

      clientReq.on("error", (err) => {
        console.error(`Error on client request stream: ${err.message}`);
        proxyReq.destroy();
      });
    });

    this.server.listen(this.port, () => {
      console.log(`Load Balancer listening on port ${this.port}`);
    });
  }
}
