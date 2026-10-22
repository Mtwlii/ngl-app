import { AppError } from "../../pkg/error/error.js";

export const otpExpired = new AppError("OTP Expired, please resend OTP", 404); // 404 not found
export const otpInvalid = new AppError("Invalid OTP", 400); // 400 bad request
export const InvalidEmailOrPass = new AppError(
  "Invalid Email or Password",
  403,
); // 403  forbidden
