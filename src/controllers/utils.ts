import * as http from "node:http";
import { IRoute } from "./Route.interface";


export function getUserIdFromUrl(url: string | undefined): string | null {
  if (!url) {
    throw new Error("Missing uuid");
  }
  const parts = url.split("/");
  const userId = parts[parts.length - 1];

  return userId;
}


export async function parseJSONBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (body.trim() === "") {
          return reject(new Error("Request body is empty or not valid JSON."));
        }
        resolve(JSON.parse(body) as T);
      } catch (error) {
        reject(new Error("Invalid JSON in request body.", { cause: error }));
      }
    });

    req.on("error", (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });
  });
}


export function injectRoutes(
  routes: IRoute[], req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }) {
  const hasRoute = routes?.some((route) => {
    if (route.match(req.url, req.method)) {
      route.execute(req, res);
      return true;
    }
  });

  if (!hasRoute) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `${req.url} Route Not Found`
      })
    );
    console.error(`Request ${req.url} weren't handled by any existing route.`);
  }
}
