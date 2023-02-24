import { Router } from "express";
import userRouter from "./userRouter";
import cardsRouter from "./cardsRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardsRouter);

export default router;
