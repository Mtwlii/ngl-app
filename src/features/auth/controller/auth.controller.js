import { toMs } from "../../../common/Utils/time.js";
import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
  try {
    const createdUser = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for the activation OTP.",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyAccount(req, res, next) {
  try {
    const { email, otpCode } = req.body;
    const updatedUser = await authService.verifyOTP(email, otpCode);

    res.status(200).json({
      success: true,
      message: "User verified successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.cookie("access_token", token, {
      httpOnly: true, // secure: true,  // 100% secure
      maxAge: toMs(1, "hours"), // session expires after 1 hour
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

export async function sendOtp(req, res, next) {
  try {
    const { email } = req.body;
    await authService.sendOtp(email);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully, Check Your email",
    });
  } catch (err) {
    next(err);
  }
}

// Reset Password
export async function resetPassword(req, res, next) {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "email, otpCode and newPassword are required",
      });
    }
    
    await authService.resetPassword(email, otpCode, newPassword);

    res.status(200).json({
      success: true,
      message: "Your Password Has been Updated",
    });
  } catch (err) {
    next(err);
  }
}