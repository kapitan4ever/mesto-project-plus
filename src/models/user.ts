import mongoose from 'mongoose';
import { IUser } from '../types';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле name является обязательным"],
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
    },
    avatar: {
      type: String,
      required: {
        value: true,
        message: "Поле avatar является обязательным",
      },
      validate: {
        validator: function (v: string) {
          return /^https?:\/\//i.test(v);
        },
        message: (props: any) =>
          `${props.value} не является корректной ссылкой!`,
      },
    },
    about: {
      type: String,
      required: [true, "Поле about является обязательным"],
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [200, "Максимальная длина 200 символов"],
    },
  },
  { versionKey: false }
);

export default mongoose.model<IUser>('user', userSchema);
