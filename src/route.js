import express from "express";
import userRouter from "./app/user/user.routes.js";
import authRouter from "./app/auth/auth.routes.js";
import messageRouter from "./app/message/message.routes.js";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/message", messageRouter);
