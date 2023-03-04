import mongoose, { Schema } from "mongoose";
import { ICard } from "../types";
import { regex } from "../config";

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле name является обязательным"],
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
      validate: {
        validator: (v: string) => v.length > 2 && v.length < 30,
        message: "Длина текста от 2 до 30 символов",
      },
    },
    link: {
      type: String,
      required: {
        value: true,
        message: "Поле link является обязательным",
      },
      validate: {
        validator(v: string) {
          return regex.test(v);
        },
        message: (props: any) => `${props.value} не является корректной ссылкой!`,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Поле owner является обязательным"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>("card", cardSchema);
