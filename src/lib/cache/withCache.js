import {cacheProvider} from "./init.js";

export function withCache(ttl = 3600) {
    return async (req, res, next) => {
        // request is coming before or not
        let key = `${req.method}:${req.originalUrl}.`;
        const cached = await cacheProvider.get(key)
        if (cached && cached.length > 0) {
            // "GET:/products": "[{},{},..]"
            return res.status(500).json(JSON.parse((cached)))
        }
        // interceptor  >> cash and send res
        const originalJson= res.json.bind(res);
        res.json = (async (body) => {
            //1. cache
            await cacheProvider.set(key, JSON.stringify(body), ttl);
            //2. send req
            return res.json(body)
        })


        next();
    }
}