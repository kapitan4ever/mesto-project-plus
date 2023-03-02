import { Errback, Request, Response } from "express";
import RequestError from "../error/error";

export default function errHandler(
  err: Errback,
  _req: Request,
  res: Response,
) {
  if (err instanceof RequestError) {
    return res.status(err.code).json({ message: err.message });
  }
  return res.status(500).json({ message: "На сервере произошла ошибка" });
}
