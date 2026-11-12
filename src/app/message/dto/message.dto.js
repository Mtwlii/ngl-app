// Data Transfer Object for Message by zod
import { Types } from "mongoose";
import { z } from "zod";

export const sendMessageDto = z.object({
  content: z.string().trim().min(1).max(500),
  receiver: z
    .string()
    .trim()
    .min(1)
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Receiver must be a valid ObjectId",
    }),
  
  // isAnonymous: z.boolean().default(true),
});
