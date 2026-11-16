import { cacheProvider } from "../cache/init.js";
import { logger } from "../../pkg/logger/logger.js";

// Opt-in: only active when the client sends an `Idempotency-Key` header.
// The key is scoped per method + url + client (user id or IP) so two different
// clients can never collide, and a missing header never creates a shared key.
export function idempotency(ttl = 60 * 60 * 24) {
  return async function (req, res, next) {
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) return next();

    const key = `idem:${req.method}:${req.originalUrl}:${req.user?.id ?? req.ip}:${idempotencyKey}`;

    try {
      const cached = await cacheProvider.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.status(409).json(JSON.parse(cached));
      }
    } catch (err) {
      // fail open: a cache outage must not take the endpoint down
      logger.warn("idempotency cache read failed", { error: err.message });
      return next();
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await cacheProvider.set(key, JSON.stringify(body), ttl);
          res.setHeader("X-Cache", "MISS");
        } catch (err) {
          logger.warn("idempotency cache write failed", { error: err.message });
        }
      }
      return originalJson(body);
    };
    next();
  };
}
