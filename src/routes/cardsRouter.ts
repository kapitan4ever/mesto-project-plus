import { Router } from "express";
import {
  createCardValidation,
  getCardValidation,
} from "../validation/cardValidation";
import CardController from "../controllers/cardController";

const cardsRouter = Router();
cardsRouter.get("/", CardController.getCards);
cardsRouter.post("/", createCardValidation, CardController.createCard);
cardsRouter.delete("/:cardId", getCardValidation, CardController.deleteCardById);
cardsRouter.put("/:cardId/likes", getCardValidation, CardController.likeCard);
cardsRouter.delete("/:cardId/likes", getCardValidation, CardController.dislikeCard);

export default cardsRouter;
