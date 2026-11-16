import { model, Schema } from "mongoose";

//Schema
const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// inbox query: by receiver, newest first
messageSchema.index({ receiver: 1, createdAt: -1 });

//Model
export const Message = model("Message", messageSchema);
