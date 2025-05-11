import * as http from "node:http";
import { ServerError } from "../controllers/errors";

interface ErrorHandlerOptions {
  errorCode: number;
  errorMessage?: string;
}

export function responceOnError(options: ErrorHandlerOptions) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const [, res] = args as [http.IncomingMessage, http.ServerResponse<http.IncomingMessage>];


        const errorMessage = error instanceof Error
          ? error.message
          : options.errorMessage || "Internal Server Error";


        res.writeHead(error instanceof ServerError ? error.code : options.errorCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: errorMessage,
          errorCode: error instanceof ServerError ? error.code : options.errorCode
        }));
      }
    };

    return descriptor;
  };
}
