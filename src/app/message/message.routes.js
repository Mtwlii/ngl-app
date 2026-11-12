import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { authGuard } from "../../lib/auth/guard.js";

const messageRouter = Router();

// مرسل معروف: لازم token
messageRouter.post("/send", authGuard, messageController.sendMessage);

// مجهول: من غير authGuard
messageRouter.post("/send/anonymous", messageController.sendAnonymousMessage);

// allMessage
messageRouter.get("/all-messages", authGuard, messageController.getAllMessages);


export default messageRouter;
