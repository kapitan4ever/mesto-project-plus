import { HttpStatusCode } from "../types";

class RequestError extends Error {
  code: HttpStatusCode;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    this.code = code;
  }
}

//500
function internalServerError(message: string) {
  return new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
}
//404
function notFoundError(message: string) {
  return new RequestError(HttpStatusCode.NOT_FOUND, message);
}
//400
function badRequest(message: string) {
  return new RequestError(HttpStatusCode.BAD_REQUEST, message);
}
//403
function forBidden(message: string) {
  return new RequestError(HttpStatusCode.FORBIDDEN, message);
}
//401
function authUser(message: string) {
  return new RequestError(HttpStatusCode.UNAUTHORIZED, message);
}
//409
function conflict(message: string) {
  return new RequestError(HttpStatusCode.CONFLICT, message);
}

export {
  internalServerError,
  notFoundError,
  badRequest,
  forBidden,
  authUser,
  conflict,
};
