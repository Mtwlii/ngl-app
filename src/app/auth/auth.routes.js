import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { loginLimiter, otpLimiter } from "../../lib/middlewares/rateLimiter.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";

const authRouter = Router();

// register
authRouter.post("/register", authController.register);

// verify account (OTP)
authRouter.patch("/verify-account", otpLimiter, authController.verifyAccount);

// login
authRouter.post("/login", loginLimiter, authController.login);

// resend OTP
authRouter.post("/send-otp", otpLimiter, authController.sendOtp);

// reset password - idempotent route (when the client sends an Idempotency-Key header)
authRouter.patch(
  "/reset-password",
  otpLimiter,
  idempotency(),
  authController.resetPassword,
);

// Login With Google (POST: it creates a session; was PATCH)
authRouter.post("/login-with-google", loginLimiter, authController.loginWithGoogle);

export default authRouter;
