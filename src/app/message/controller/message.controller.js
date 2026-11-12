import { sendMessageDto } from "../dto/message.dto.js";
import * as messageService from "../service/message.service.js";
import { validateBody } from "./../../../lib/validation/vakidation.js";

async function handleSend(req, res, next, sender) {
  try {
    validateBody(sendMessageDto, req.body);
    const { content, receiver } = req.body;
    // const sender = req.user && !isAnonymous ? req.user.id : null;
    const createdMessage = await messageService.sendMessage({
      content,
      receiver,
      sender,
    });
    res.status(201).json({
      message: "Message sent successfully",
      data: createdMessage,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}

// معروف: الـ sender من الـ token (authGuard ضامن إنه موجود)
export function sendMessage(req, res, next) {
  return handleSend(req, res, next, req.user.id);
}

// مجهول
export function sendAnonymousMessage(req, res, next) {
  return handleSend(req, res, next, null);
}

// get all messages for a user
export async function getAllMessages(req, res, next) {
  try {
    const userId = req.user.id;
    const messages = await messageService.getAllMessages(userId);
    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
