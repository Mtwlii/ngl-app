import { model, Schema } from "mongoose";

// Schema
const otpSchema = new Schema(
  {
    otpCode: {
      type: String,
      required: true,
      length: 6,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, //generate index of type TTL (Time To Live) on the expireAt field, which will automatically delete the document after 5 minutes (300 seconds) from the time specified in the expireAt field.
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);


// Model

export const OTP = model("OTP", otpSchema);
