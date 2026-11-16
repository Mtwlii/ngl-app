import { env } from "../../../lib/config/env.js";
import jwt from "jsonwebtoken";

// jsonwebtoken reads a numeric expiresIn as SECONDS, so use a string span here.
// (It must match the cookie maxAge in lib/auth/cookie.js.)
export function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: "1h" });
}
