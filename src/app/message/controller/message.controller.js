import { sendMessageDto } from "../dto/message.dto.js";
import * as messageService from "../service/message.service.js";
import { validateBody } from "./../../../lib/validation/vakidation.js";

async function handleSend(req, res, sender) {
  // use the VALIDATED data (trimmed / sanitized), not the raw body
  const { content, receiver } = validateBody(sendMessageDto, req.body);
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
}

// known sender: taken from the token (authGuard guarantees it exists)
export function sendMessage(req, res) {
  return handleSend(req, res, req.user.id);
}

// anonymous
export function sendAnonymousMessage(req, res) {
  return handleSend(req, res, null);
}

// get all messages for a user
export async function getAllMessages(req, res) {
  const messages = await messageService.getAllMessages(req.user.id);
  res.status(200).json({
    message: "Messages retrieved successfully",
    data: messages,
    status: "success",
  });
}
