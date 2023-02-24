import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/:userId", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.patch("/me", UserController.updateProfile);
userRouter.patch("/me/avatar", UserController.updateProfileAvatar);

export default userRouter;
