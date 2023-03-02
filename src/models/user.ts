/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "../types";
import RequestError from "../error/error";
import { regex } from "../config";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 30,
        message: "Длина текста от 2 до 30 символов",
      },
    },
    avatar: {
      type: String,
      validate: {
        validator(v: string) {
          return regex.test(v);
        },
        message: (props: any) => `${props.value} не является корректной ссылкой!`,
      },
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [200, "Максимальная длина 200 символов"],
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 200,
        message: "Длина текста от 2 до 200 символов",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Неверный формат почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static(
  "findUserByCredentials",
  async function findUserByCredentials(
    this: any,
    email: string,
    password: string,
  ) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
      return RequestError.authUser("Неправильные почта или пароль");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return RequestError.authUser("Неправильные почта или пароль");
    }

    return user;
  },
);

export default mongoose.model<IUser, IUserModel>("user", userSchema);
