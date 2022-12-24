import Redis from "ioredis";
let TokenStore: Redis;
export const connectToRedis = () => {
  if (process.env.REDIS_URI) {
    TokenStore = new Redis(process.env.REDIS_URI);
    TokenStore.on("connect", () => console.log("Connected to Redis"));
  }
};
export const storeTokenInRedis = async (userId: string, token: string) => {
  const length = await TokenStore.llen(userId);
  if (length >= 3) {
    await TokenStore.rpop(userId);
  } else {
    await TokenStore.lpush(userId, token);
  }
};

export const checkIfInRedis = async (userId: string, token: string) => {
  const tokens = await TokenStore.lrange(userId, 0, -1);
  return tokens.includes(token);
};

export const clearTokensInRedis = async (userId: string) => {
  await TokenStore.del(userId);
};
