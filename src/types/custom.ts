import { Request } from "express";
import { ObjectId } from "mongoose";

export interface IRequestCustom extends Request {
  user?: {
    _id: string | ObjectId;
  }
}
