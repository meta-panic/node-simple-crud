import * as http from "node:http";


export type SupportedMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ExecuteFnType = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;

// Type to ensure path starts with / and doesn't end with /
export type PathMatcher = `/${string}`;

// Helper function to validate path
export function validatePath(path: string): PathMatcher {
  if (!path.startsWith("/")) {
    throw new Error("Path must start with /");
  }
  if (path.endsWith("/")) {
    throw new Error("Path must not end with /");
  }
  return path as PathMatcher;
}

export interface IRoute {
  execute: ExecuteFnType;
  match(url?: string, reqMethod?: string): boolean;
}
