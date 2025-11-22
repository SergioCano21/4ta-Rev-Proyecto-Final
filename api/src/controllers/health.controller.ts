import { Request, Response } from "express";

export const health = (_req: Request, res: Response) => {
  console.log("Entering health endpoint");
  res.status(200).json({ error: false, message: "Health check is at 100%" });
};
