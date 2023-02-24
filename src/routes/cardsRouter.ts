import { Router } from "express";
import CardController from "../controllers/cardController";

const cardsRouter = Router();
cardsRouter.get("/", CardController.getCards);
cardsRouter.post("/", CardController.createCard);
cardsRouter.delete("/:cardId", CardController.deleteCardById);
cardsRouter.put("/:cardId/likes", CardController.likeCard);
cardsRouter.delete("/:cardId/likes", CardController.dislikeCard);

export default cardsRouter;
