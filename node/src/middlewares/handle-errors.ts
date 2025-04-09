import util from "util";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export function handleErrors(
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(`Express Main Error Handler\n${util.inspect(err)}`);

  if (err instanceof Joi.ValidationError) {
    res.status(400).json({
      code: 400,
      message: err.details.map((err) => err.message).join("; "),
    });
    return;
  }

  res.status(500).json({ code: 500, message: "Internal server error" });
}
