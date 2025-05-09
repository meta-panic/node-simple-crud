import * as http from "node:http";


export type SupportedMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ExecuteFnType = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void;

export interface IRoute {
  execute: ExecuteFnType;
  match(url?: string, reqMethod?: string): boolean;
}