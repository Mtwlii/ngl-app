import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
const authRouter = Router();


//register
authRouter.post("/register", authController.register);
//verifyAccount
authRouter.patch("/verify-account", authController.verifyAccount);
//login
authRouter.post("/login", authController.login);
//logout
// authRouter.post("/logout", authController.logout);


export default authRouter;
