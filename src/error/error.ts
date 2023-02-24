import { HttpStatusCode } from "../types";

class RequestError extends Error {
  code: HttpStatusCode;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    this.code = code;
  }
}

function internalServerError(message: string) {
  return new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
}

function notFoundError(message: string) {
  return new RequestError(HttpStatusCode.NOT_FOUND, message);
}

function badRequest(message: string) {
  return new RequestError(HttpStatusCode.BAD_REQUEST, message);
}

function forBidden(message: string) {
  return new RequestError(HttpStatusCode.FORBIDDEN, message);
}

export { internalServerError, notFoundError, badRequest, forBidden };
