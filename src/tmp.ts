import { NextFunction, Response } from "express";
import { IRequestCustom } from "./types";

export const tmpId = (req: IRequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: "63f8a72118c96d393e87f018", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
};

export default {};// обход ошибки линтера
