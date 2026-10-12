import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
const authRouter = Router();

authRouter.post("/register", authController.register);
// authRouter.post("/login", authController.login);
// authRouter.post("/logout", authController.logout);
// authRouter.post("/verify", authController.verify);
// authRouter.post("/resend-otp", authController.resendOTP);
// authRouter.post("/verify-otp", authController.verifyOTP);
// authRouter.post("/forgot-password", authController.forgotPassword);
// authRouter.post("reset-password", authController.resetPassword);
// authRouter.post("update-password", authController.updatePassword);
// authRouter.post("update-profile", authController.updateProfile);
// authRouter.post("change-password", authController.changePassword);
// authRouter.post("change-email", authController.changeEmail);
// authRouter.post("change-email-otp", authController.changeEmailOTP);
// authRouter.post("verify-change-email-otp", authController.verifyChangeEmailOTP);
// authRouter.post("update-email", authController.updateEmail);

export default authRouter;
