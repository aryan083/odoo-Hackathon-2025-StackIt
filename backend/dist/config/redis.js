var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    yield redisClient.connect();
    console.warn('Redis connected');
});
export const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.quit();
});
