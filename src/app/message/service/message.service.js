import { AppError } from "../../../lib/error/error.js";
import { userNotExist } from "../../user/errors.js";
import * as userRepository from "../../user/repository/user.repository.js";
import * as messageRepository from "../repository/message.repository.js";

export async function sendMessage({ content, receiver, sender }) {
  // 1. ممنوع يبعت لنفسه (بس لو المرسل معروف)
  if (sender && String(sender) === String(receiver)) {
    throw new AppError("You cannot send a message to yourself", 400);
  }

  // 2. تأكد إن المستقبل موجود
  const receiverUser = await userRepository.findUserById(receiver);
  if (!receiverUser) throw userNotExist;

  // 3. احفظ
  return await messageRepository.saveMessage({ content, receiver, sender });
}

// getAllMessage
export async function getAllMessages(userId) {
  const messages = await messageRepository.getAllMessagesByUserId(userId); //[{content: "hello", sender: "1", receiver: "2"}] | nul
  if (messages.length == 0) throw new AppError("No messages found", 404);
  return messages;
}
