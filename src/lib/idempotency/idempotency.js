import { cacheProvider } from "../cache/init.js";

export function idempotency(ttl = 33600) {
  return async function (req, res, next) {
    const idempotencyKey = req.headers["idempotency-key"];
    let key = `{req.method}:${req.originalUrl}:${idempotencyKey}`;
    const cached = await cacheProvider.get(key);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.status(409).json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await cacheProvider.set(key, JSON.stringify(body), ttl);
        res.setHeader("X-Cache", "MISS");
      }
      return originalJson(body);
    };
    next();
  };
}
