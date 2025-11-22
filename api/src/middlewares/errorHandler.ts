export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(err.message);
    return res.status(err.statusCode).json({ error: true, message: err.message });
  }

  console.log(err.message ?? "Unexpected Error");
  return res.status(500).json({ error: true, message: err.message ?? "Unexpected Error" });
};
