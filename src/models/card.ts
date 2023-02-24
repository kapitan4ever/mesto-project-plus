import mongoose, { Schema } from "mongoose";
import { ICard } from "../types";

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле name является обязательным"],
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
    },
    link: {
      type: String,
      required: {
        value: true,
        message: "Поле avatar является обязательным",
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Поле about является обязательным"],
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
