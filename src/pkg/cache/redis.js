import Redis from "ioredis";

export class RedisCacheProvider {
  client;

  constructor(config) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      lazyConnect: true, // waite
      maxLoadingRetryTime: 3,
    });
    this.client.on("error", (err) =>
      console.log("redis server error", err.message),
    );
    this.client
      .connect()
      .catch((err) => console.log("connection failed", err.message));
  }

  async set(key, value, ttl) {
    return await this.client.set(key, value, "EX", ttl);
  }
  async get(key) {
    return await this.client.get(key);
  }
  async delete(key) {
    return await this.client.del(key);
  }
}

// new RedisCacheProvider({
//     host: 'localhost',
//     port:  6379,
//     password: 'password',
//     db: 0
// })
