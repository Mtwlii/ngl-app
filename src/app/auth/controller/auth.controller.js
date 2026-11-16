import { validateBody } from "../../../lib/validation/vakidation.js";
import { accessTokenCookieOptions } from "../../../lib/auth/cookie.js";
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyAccountDto,
  GoogleLoginDto,
} from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";

// Express 5 forwards rejected promises to the error handler automatically,
// so the try/catch + next(error) boilerplate is no longer needed here.

export async function register(req, res) {
  const data = validateBody(RegisterDto, req.body);
  const createdUser = await authService.register(data);
  res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please check your email for the activation OTP.",
    data: createdUser,
  });
}

export async function verifyAccount(req, res) {
  const { email, otpCode } = validateBody(VerifyAccountDto, req.body);
  const updatedUser = await authService.verifyOTP(email, otpCode);
  res.status(200).json({
    success: true,
    message: "User verified successfully.",
    data: updatedUser,
  });
}

export async function login(req, res) {
  const { email, password } = validateBody(LoginDto, req.body);
  const token = await authService.login(email, password);
  res.cookie("access_token", token, accessTokenCookieOptions);
  res.status(200).json({
    success: true,
    message: "Login successful",
  });
}

export async function sendOtp(req, res) {
  const { email } = validateBody(SendOtpDto, req.body);
  await authService.sendOtp(email);
  res.status(200).json({
    success: true,
    message: "OTP sent successfully, Check Your email",
  });
}

export async function resetPassword(req, res) {
  const { email, otpCode, newPassword } = validateBody(
    ResetPasswordDto,
    req.body,
  );
  await authService.resetPassword(email, otpCode, newPassword);
  res.status(200).json({
    success: true,
    message: "Your Password Has been Updated",
  });
}

export async function loginWithGoogle(req, res) {
  const { idToken } = validateBody(GoogleLoginDto, req.body);
  const token = await authService.loginWithGoogle(idToken);
  // options must be the 3rd argument of res.cookie (they were silently dropped before)
  res.cookie("access_token", token, accessTokenCookieOptions);
  res.status(200).json({
    success: true,
    message: "User login successful",
  });
}
