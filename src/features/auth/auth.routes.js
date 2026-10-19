import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { otpLimiter } from "../../common/middlewares/rateLimiter.js";

const authRouter = Router();

// register
authRouter.post("/register", authController.register);

// verify account (OTP)
authRouter.patch("/verify-account", otpLimiter, authController.verifyAccount);

// login
authRouter.post("/login", authController.login);

// resend OTP
authRouter.post("/send-otp", otpLimiter, authController.sendOtp);

authRouter.patch("/reset-password", otpLimiter, authController.resetPassword);

// Login With Google
authRouter.patch("/login-with-google", authController.loginWithGoogle);

// logout
// authRouter.post("/logout", authController.logout);

export default authRouter;
