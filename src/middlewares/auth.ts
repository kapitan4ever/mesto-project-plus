import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import RequestError from "../error/error";

const { authUser } = RequestError;

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace("Bearer ", "");

export default (req: IAuthRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authUser("Авторизуйтесь пожалуйста");
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      (process.env.SECRET_KEY as string) || "some-secret-key"
    );
  } catch (err) {
    return authUser("Авторизуйтесь пожалуйста");
  }

  req.user = payload as { _id: JwtPayload };

  next();
};