import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
  try {
    const createdUser = await authService.register(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully. Please check your email for the activation OTP.",
        data: createdUser,
    });
  } catch (error) {
    next(error);
  }
}
