export class ServerError extends Error {
  code: number;

  constructor({ message, errorCode, cause }: { message: string, errorCode: number, cause?: unknown }) {
    super(message);
    this.name = "ServerError";
    this.code = errorCode;
    this.cause = cause;
  }
}
