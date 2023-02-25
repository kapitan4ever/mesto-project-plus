import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import { HttpStatusCode, IRequestCustom } from "../types";
import Card from "../models/card";
import {
  badRequest,
  forBidden,
  internalServerError,
  notFoundError,
} from "../error/error";

interface ICardController {
  getCards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  deleteCardById(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  createCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  likeCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  dislikeCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
}

class CardController implements ICardController {
  async createCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const id = req.user?._id;
      const { name, link } = req.body;
      const newCard = await Card.create({
        name,
        link,
        owner: id,
      });
      return res.status(HttpStatusCode.CREATED).send(newCard);
    } catch (err) {
      if (err) {
        return next(badRequest("Incorrect data was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async deleteCardById(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { cardId } = req.params;
      const card = await Card.findByIdAndDelete(cardId);
      if (!card) {
        return next(notFoundError("Required card not found."));
      }
      if (card.owner.toString() !== req.user?._id) {
        return next(forBidden("Do not delete the cards of others."));
      }
      return res.status(HttpStatusCode.OK).send({
        message: "Required card removed with success.",
      });
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Incorrect id was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async dislikeCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const id = req.user?._id as ObjectId;
      const { cardId } = req.params;
      const card = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: id } },
        { new: true }
      );
      if (!card) {
        return next(notFoundError("Required card not found."));
      }
      return res.status(HttpStatusCode.OK).send(card);
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Incorrect id was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }

  async getCards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const cards = await Card.find({});
      return res.status(HttpStatusCode.OK).send(cards);
    } catch {
      return next(internalServerError("Server error"));
    }
  }

  async likeCard(
    req: IRequestCustom,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const id = req.user?._id;
      const { cardId } = req.params;
      const card = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: id } },
        { new: true }
      );
      if (!card) {
        return next(notFoundError("Required card not found."));
      }
      return res.status(HttpStatusCode.OK).send(card);
    } catch (err) {
      if (err instanceof Error && err.name === "CastError") {
        return next(badRequest("Incorrect id was submitted."));
      }
      return next(internalServerError("Server error"));
    }
  }
}

export default new CardController();
