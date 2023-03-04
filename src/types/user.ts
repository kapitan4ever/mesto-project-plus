/* eslint-disable no-unused-vars */
import { Model, Document } from "mongoose";

export interface IUser {
  name: string;
  id: string;
  avatar: string;
  about: string;
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<any, any, IUser>>;
}
