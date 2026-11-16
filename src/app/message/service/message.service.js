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

// getAllMessage: an empty inbox is not an error -> [] (was a 404)
export async function getAllMessages(userId) {
  return await messageRepository.getAllMessagesByUserId(userId);
}
