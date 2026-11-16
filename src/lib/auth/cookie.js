import { toMs } from "../../pkg/utils/time.js";

// Single source of truth for the auth cookie (used by login + Google login).
// If your frontend lives on a different site, use sameSite: "none" (requires secure: true).
export const accessTokenCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: toMs(1, "hours"),
};
