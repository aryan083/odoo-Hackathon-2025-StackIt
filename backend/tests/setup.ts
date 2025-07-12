import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Mock Socket & Redis to avoid opening real connections during tests
jest.mock('../src/utils/Socket.ts', () => ({
  emitToUser: jest.fn(),
  emitToQuestion: jest.fn(),
  getIO: () => ({ to: () => ({ emit: () => {} }) }),
}));
// Provide fallback for REDIS_URL to avoid config/redis.ts throwing in tests
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = 'redis://localhost:6379';
}

// Log unhandled async errors so Jest shows them
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err);
});

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (db) {
    const collections = await db.collections();
    for (const collection of collections) await collection.deleteMany({});
  }
});
