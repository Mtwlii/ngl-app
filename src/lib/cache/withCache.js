import { cacheProvider } from "./init.js";

export function withCache(ttl = 3600) {
  return async (req, res, next) => {
    // request is coming before or not
    let key = `${req.method}:${req.originalUrl}.`;
    const cached = await cacheProvider.get(key);
    if (cached && cached.length > 0) {
      res.setHeader("X-Cache", "HIT");
      // "GET:/products": "[{},{},..]"
      return res.status(200).json(JSON.parse(cached));
    }
    // interceptor  >> cash and send res
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
     if (res.statusCode >= 200 && res.statusCode < 300) {
       //1. cache body --> {message: "success", data: [{}, {}, ...]}
      await cacheProvider.set(key, JSON.stringify(body), ttl);
      //2. send req
      res.setHeader("X-Cache", "MISS");
     }
      return originalJson(body);
    };

    next();
  };
}