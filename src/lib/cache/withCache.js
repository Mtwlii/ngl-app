import { cacheProvider } from "./init.js";
import { logger } from "../../pkg/logger/logger.js";

// Usage: router.get("/x", authGuard, withCache(60), handler)   <-- call it!
// The key includes the user id, so per-user responses can't leak between users.
export function withCache(ttl = 3600) {
  return async (req, res, next) => {
    const key = `cache:${req.user?.id ?? "public"}:${req.method}:${req.originalUrl}`;

    try {
      const cached = await cacheProvider.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (err) {
      // fail open: serve from the DB if Redis is down
      logger.warn("cache read failed", { error: err.message });
      return next();
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await cacheProvider.set(key, JSON.stringify(body), ttl);
          res.setHeader("X-Cache", "MISS");
        } catch (err) {
          logger.warn("cache write failed", { error: err.message });
        }
      }
      return originalJson(body);
    };

    next();
  };
}
