/* eslint-disable no-useless-escape */
import { Router } from "express";
import UserController from "../controllers/userController";
import {
  updateAvatarValidation,
  updateInfoValidation,
  getUserByIdValidation,
} from "../validation/userValidation";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/:userId", getUserByIdValidation, UserController.getUserById);
userRouter.get("/me", UserController.getUserInfo);

userRouter.patch("/me", updateInfoValidation, UserController.updateProfile);
userRouter.patch("/me/avatar", updateAvatarValidation, UserController.updateProfileAvatar);

export default userRouter;
