import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { AppError } from "../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { User } from "../types/types";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Entering login endpoint");

    const { username, password }: User = req.body;

    if (!username || !password) {
      throw new AppError(400, "Missing arguments");
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (!existingUser) {
      throw new AppError(400, "Invalid login");
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword) {
      throw new AppError(400, "Invalid login");
    }

    const accessToken = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: existingUser.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    console.log("Login successful");
    res.status(200).json({ error: false, message: "Login successful", access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Entering register endpoint");

    const { username, password }: User = req.body;

    if (!username || !password) {
      throw new AppError(400, "Missing arguments");
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      throw new AppError(400, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    console.log("Register successful");
    console.log("Registered user: ", user.username);

    res.status(201).json({ error: false, message: "Register successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Entering refreshToken endpoint");

    const { token }: { token: string } = req.body;

    if (!token) {
      throw new AppError(400, "Missing token");
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: number };

    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: payload.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    console.log("Token refreshed for user with id: ", payload.id);
    res.status(200).json({ error: false, message: "Token refreshed successful", access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    next(error);
  }
};
