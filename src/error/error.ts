import { HttpStatusCode } from "../types";

class RequestError extends Error {
  code: HttpStatusCode;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    this.code = code;
  }

  //500
  static internalServerError(message: string) {
    return new RequestError(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }
  //404
  static notFoundError(message: string) {
    return new RequestError(HttpStatusCode.NOT_FOUND, message);
  }
  //400
  static badRequest(message: string) {
    return new RequestError(HttpStatusCode.BAD_REQUEST, message);
  }
  //403
  static forBidden(message: string) {
    return new RequestError(HttpStatusCode.FORBIDDEN, message);
  }
  //401
  static authUser(message: string) {
    return new RequestError(HttpStatusCode.UNAUTHORIZED, message);
  }
  //409
  static conflict(message: string) {
    return new RequestError(HttpStatusCode.CONFLICT, message);
  }
}

export default RequestError;
