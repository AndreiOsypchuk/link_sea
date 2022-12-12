import Redis from "ioredis";

export class TokenStore {
  private static m_Redis: Redis;
  public static Init() {
    if (process.env.REDIS_URI) {
      TokenStore.m_Redis = new Redis(process.env.REDIS_URI);
      TokenStore.m_Redis.on("connect", () =>
        console.log("Connected to Redis 🫘")
      );
    }
  }

  public static async StoreToken(key: string, token: string) {
    const size = await TokenStore.m_Redis.llen(key);
    console.log(size);
    if (size >= 3) await TokenStore.m_Redis.rpop(key);
    await TokenStore.m_Redis.lpush(key, token);
  }

  public static async Check(key: string, token: string): Promise<boolean> {
    const tokens = await TokenStore.m_Redis.lrange(key, 0, -1);
    return tokens.includes(token);
  }

  public static async ClearTokens(key: string) {
    TokenStore.m_Redis.del(key);
  }
}
