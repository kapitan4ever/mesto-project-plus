import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { HttpStatusCode, IRequestCustom } from "../types";
import RequestError from "../error/error";

const {
  conflict, authUser, badRequest, internalServerError,
} = RequestError;

interface IUserController {
  getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response>;

  getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  updateProfile(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  updateProfileAvatar(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  login(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  getUserInfo(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
}

class UserController implements IUserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.status(HttpStatusCode.OK).send(users);
    } catch {
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return next(authUser("Требуемый пользователь не найден."));
      }
      return res.status(HttpStatusCode.OK).send(user);
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Был отправлен неверный идентификатор."));
      }
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name = "Жак-Ив Кусто",
      about = "Исследователь",
      avatar = "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      email,
      password,
    } = req.body;

    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        about,
        avatar,
        email,
        password: hashPassword,
      });
      return res.status(HttpStatusCode.CREATED).send({
        data: {
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
          email: newUser.email,
        },
      });
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Были представлены неверные данные."));
      }
      if (err === 11000) {
        return next(conflict("Такой email уже используется"));
      }
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async updateProfile(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const { name, about } = req.body;
      const id = req?.user?._id;
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          about,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updateUser) {
        return next(authUser("Требуемый пользователь не найден."));
      }
      return res.status(HttpStatusCode.OK).send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Были представлены неверные данные."));
      }
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async updateProfileAvatar(
    req: IRequestCustom,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { avatar } = req.body;
      const id = req.user!._id;
      if (!avatar) {
        return next(badRequest("Некорректные данные при обновлении аватара"));
      }
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updateUser) {
        return next(authUser("Требуемый пользователь не найден."));
      }
      return res.status(HttpStatusCode.OK).send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Были представлены неверные данные."));
      }
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);
      return res.status(HttpStatusCode.OK).send({
        token: jwt.sign(
          { _id: user._id },
          (process.env.SECRET_KEY as string) || "some-secret-key",
          { expiresIn: "7d" },
        ),
      });
    } catch {
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }

  async getUserInfo(req: IRequestCustom, res: Response, next: NextFunction) {
    const userId = req.user!._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return next(authUser("Требуемый пользователь не найден."));
      }
      return res.status(HttpStatusCode.OK).send(user);
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Был отправлен неверный идентификатор."));
      }
      return next(internalServerError("На сервере произошла ошибка"));
    }
  }
}

export default new UserController();
