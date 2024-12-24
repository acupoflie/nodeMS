import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.do";

const router = express.Router();
const repo = repository.CartRepository;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValidUser = true;
  if (!isValidUser) {
    res.status(403).json({ error: "Unauthorized" });
  }

  next();
};

router.post(
  "/cart",
  authMiddleware,
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
  // comes from our auth user parsed from JWT
  const response = await service.GetCart(req.body.customerId, repo);
  res.status(200).json({
    response,
  });
});

router.patch(
  "/cart/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.id;
    const response = await service.EditCart(
      {
        id: +lineItemId,
        qty: req.body.qty,
      },
      repo
    );
    res.status(200).json({
      response,
    });
  }
);

router.delete(
  "/cart/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.id;
    const response = await service.DeleteCart(+lineItemId, repo);
    res.status(200).json({
      response,
    });
  }
);

export default router;
