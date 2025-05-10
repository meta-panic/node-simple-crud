export class ControllerError extends Error {
  code: number;

  constructor({ message, errorCode, cause }: { message: string, errorCode: number, cause?: unknown }) {
    super(message);
    this.name = "UserNotFoundError";
    this.code = errorCode;
    this.cause = cause;
  }
}
