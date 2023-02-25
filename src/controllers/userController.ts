import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { HttpStatusCode, IRequestCustom } from "../types";
import { badRequest, internalServerError, notFoundError } from "../error/error";

interface IUserController {
  getUsers(
    req: Request,
    res: Response,
    next: NextFunction
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
}

class UserController implements IUserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.status(HttpStatusCode.OK).send(users);
    } catch {
      return next(internalServerError("Server error"));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return next(notFoundError("Required user not found."));
      }
      return res.status(HttpStatusCode.OK).send(user);
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Incorrect id was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, about, avatar } = req.body;
      const newUser = await User.create({
        name,
        about,
        avatar,
      });
      return res.status(HttpStatusCode.CREATED).send(newUser);
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Incorrect data was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async updateProfile(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const { name, about } = req.body;
      const id = req?.user?._id;
      const updateUser = await User.findByIdAndUpdate(id, {
        name,
        about,
      });
      if (!updateUser) {
        return next(notFoundError("Required user not found."));
      }
      return res.status(HttpStatusCode.OK).send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Incorrect data was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async updateProfileAvatar(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { avatar } = req.body;
      const id = req.user!._id;
      const updateUser = await User.findByIdAndUpdate(id, { avatar });
      if (!updateUser) {
        return next(notFoundError("Required user not found."));
      }
      return res.status(HttpStatusCode.OK).send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        return next(badRequest("Incorrect data was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }
}

export default new UserController();
