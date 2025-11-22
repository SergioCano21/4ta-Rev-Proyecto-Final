import { NextFunction, Response } from "express";
import { AppError } from "./errorHandler";
import { AuthRequest } from "../types/types";
import { getUserFromToken } from "../utils/auth.utils";

export const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const payload = getUserFromToken(req.headers.authorization);

    if (!payload) {
      throw new AppError(401, "Missing or invalid token");
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
