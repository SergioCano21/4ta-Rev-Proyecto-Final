import { Router } from "express";
import { login, refreshToken, register } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.post("/refresh-token", refreshToken);

export default userRouter;
