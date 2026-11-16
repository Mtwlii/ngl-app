import { Message } from "../model/message.model.js";

export async function saveMessage({ content, receiver, sender }) {
  return await Message.create({
    content,
    receiver,
    sender: sender ?? null,
  });
}

export async function getAllMessagesByUserId(userId) {
  return await Message.find(
    { receiver: userId, isDeleted: false },
    {},
    {
      sort: { createdAt: -1 },
      populate: { path: "sender", select: "id name email" },
    },
  );
}
