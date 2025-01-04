import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
import { RequestAuthorizer } from "./middleware";

const router = express.Router();
const repo = repository.CartRepository;

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const err = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (err) {
        res.status(404).json({ err });
      }

      const input: CartRequestInput & { customerId: number } = {
        ...req.body,
        customerId: user.id,
      };

      const response = await service.CreateCart(input, repo);
      res.status(200).json({
        response,
      });
    } catch (err) {
      res.status(404).json({ err });
    }
  }
);

router.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    // comes from our auth user parsed from JWT

    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const response = await service.GetCart(user.id, repo);
      res.status(200).json({
        response,
      });
    } catch (err) {
      res.status(404).json({ err });
    }
  }
);

router.patch(
  "/cart/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const lineItemId = req.params.id;
      const response = await service.EditCart(
        {
          id: +lineItemId,
          qty: req.body.qty,
          customerId: user.id,
        },
        repo
      );
      res.status(200).json({
        response,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/cart/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const lineItemId = req.params.id;
      const response = await service.DeleteCart(
        { customerId: user.id, id: +lineItemId },
        repo
      );
      res.status(200).json({
        response,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
