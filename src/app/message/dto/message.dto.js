// Data Transfer Object for Message by zod
import { Types } from "mongoose";
import { z } from "zod";

export const sendMessageDto = z.object({
  // max must match the Mongoose model (200) - otherwise Mongoose rejects what Zod accepted
  content: z.string().trim().min(1).max(200),
  receiver: z
    .string()
    .trim()
    .min(1)
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Receiver must be a valid ObjectId",
    }),
});
