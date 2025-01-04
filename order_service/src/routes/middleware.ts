import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["authorization"]) {
      res.status(403).json({ error: "Unauthorized due to missing token" });
    }
    const data = await ValidateUser(req.headers["authorization"] as string);
    req.user = data;
    next();
  } catch (err) {
    res.status(403).json({ err });
  }
};
