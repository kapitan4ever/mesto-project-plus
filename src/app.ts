import express, { json } from "express";
import mongoose from "mongoose";
import { errors } from "celebrate";

import routes from "./routes";
import { PORT, URL_DB } from "./config";
import userController from "./controllers/userController";
import {
  createUserValidation,
  loginValidation,
} from "./validation/userValidation";
import auth from "./middlewares/auth";
import errHandler from "./middlewares/errHandler";
import { reqLog } from "./middlewares/log";
import { errLog } from "./middlewares/errLog";

require("dotenv").config();

const app = express();

app.use(json());

app.use(reqLog);

app.post("/signin", loginValidation, userController.login);
app.post("/signup", createUserValidation, userController.createUser);

// авторизация
app.use(auth);

app.use(routes);

app.use(errors());
app.use(errHandler);
app.use(errLog);

async function connect() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(URL_DB);
    console.log(`DB Connect`);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (error) {
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log("Ошибка подключения к базе данных");
    }
    console.log("Ошибка запуска сервера", error);
  }
}

connect();
