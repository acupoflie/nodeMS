import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.do";

const router = express.Router();
const repo = repository.CartRepository;

router.post(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (err) {
        res.status(404).json({ err });
      }

      const response = await service.CreateCart(
        req.body as CartRequestInput,
        repo
      );
      res.status(200).json({
        response,
      });
    } catch (err) {
      res.status(404).json({ err });
    }
  }
);

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
  const response = await service.GetCart(req.body, repo);
  res.status(200).json({
    response,
  });
});

router.patch(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.EditCart(req.body, repo);
    res.status(200).json({
      response,
    });
  }
);

router.delete(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.DeleteCart(req.body, repo);
    res.status(200).json({
      response,
    });
  }
);

export default router;
