import { AppError } from "../error/error.js";
import jwt from "jsonwebtoken";

export async function authGuard(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token)
      throw new AppError("Unauthorized, no access token provided", 401);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id)
      throw new AppError("Unauthorized, invalid access token", 401);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    next(
      err instanceof AppError
        ? err
        : new AppError("Unauthorized, invalid access token", 401),
    );
  }
}