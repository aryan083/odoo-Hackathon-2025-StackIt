/**
 * Redis client for caching & pub/sub.
 * Exported client can be reused anywhere (e.g., Socket.IO adapter).
 */
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const { REDIS_URL = '' } = process.env;
if (!REDIS_URL) {
  throw new Error('❌  REDIS_URL not set in environment variables');
}

export const redisClient = createClient({ url: REDIS_URL });

export const connectRedis = async (): Promise<void> => {
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
  console.warn('Redis connected');
};

export const disconnectRedis = async (): Promise<void> => {
  await redisClient.quit();
};