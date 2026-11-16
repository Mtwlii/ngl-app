import rateLimit from "express-rate-limit";

function limiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many attempts, please try again later",
    },
  });
}

// 5 requests per IP / 5 minutes
export const otpLimiter = limiter({ windowMs: 5 * 60 * 1000, limit: 5 });

// brute-force protection on /auth/login
export const loginLimiter = limiter({ windowMs: 15 * 60 * 1000, limit: 10 });

// spam protection on anonymous messages
export const anonymousMessageLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 10,
});
