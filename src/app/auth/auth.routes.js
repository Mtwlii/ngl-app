import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { otpLimiter } from "../../lib/middlewares/rateLimiter.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";

const authRouter = Router();

// register
authRouter.post("/register", authController.register);

// verify account (OTP)
authRouter.patch("/verify-account", otpLimiter, authController.verifyAccount);

// login
authRouter.post("/login", authController.login);

// resend OTP
authRouter.post("/send-otp", otpLimiter, authController.sendOtp);

// reset password - idempotent route
authRouter.patch("/reset-password", otpLimiter, idempotency(), authController.resetPassword);

// Login With Google
authRouter.patch("/login-with-google", authController.loginWithGoogle);

// logout
// authRouter.post("/logout", authController.logout);

export default authRouter;
