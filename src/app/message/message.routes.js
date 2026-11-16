import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { authGuard } from "../../lib/auth/guard.js";
import { anonymousMessageLimiter } from "../../lib/middlewares/rateLimiter.js";

const messageRouter = Router();

// known sender: token required
messageRouter.post("/send", authGuard, messageController.sendMessage);

// anonymous: no token, but rate limited against spam
messageRouter.post(
  "/send/anonymous",
  anonymousMessageLimiter,
  messageController.sendAnonymousMessage,
);

// all messages of the logged-in user
messageRouter.get("/all-messages", authGuard, messageController.getAllMessages);

export default messageRouter;
