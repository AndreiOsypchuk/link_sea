import Redis from "ioredis";

class TokenStore {
  private static m_Redis: Redis;
  constructor() {
    TokenStore.m_Redis = new Redis("cache:6379");
    TokenStore.m_Redis.on("connect", () => console.log("Connected to Redis 🫘"));
  }
  public async Test() {
    TokenStore.m_Redis.flushall();
    for (let i = 0; i < 3; i++)
      TokenStore.m_Redis.lpush("items", "testing" + i);
    const arr = await TokenStore.m_Redis.lrange("items", 0, -1);
    console.log(arr);
  }
}

export const tokenStore = new TokenStore();
