import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import RequestError from "../error/error";

const { authUser, internalServerError } = RequestError;

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace("Bearer ", "");

export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return authUser("Авторизуйтесь пожалуйста");
    }

    const token = extractBearerToken(authorization);
    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        token,
        (process.env.SECRET_KEY as string) || "some-secret-key"
      ) as JwtPayload;
    } catch (err) {
      return authUser("Неверный токен авторизации");
    }

    req.user = payload as { _id: JwtPayload };

    next();
  } catch (err) {
    console.error("Ошибка авторизации:", err);
    return internalServerError("Что-то пошло не так");
  }
};
