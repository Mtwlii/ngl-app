import { model, Schema } from "mongoose";

//schema

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      required: function () {
        return this.provider === "local";
      },
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    dob: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    profilePicPath: {
      type: String,
    },
    cvPath: {
      type: String,
    },
    coverImagePath: {
      type: String,
    }
  },
  {
    timestamps: true,
    // never leak the password hash (or __v) in any JSON response
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

//model

export const User = model("User", userSchema);
