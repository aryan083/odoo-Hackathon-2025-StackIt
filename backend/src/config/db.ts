/**
 * MongoDB connection helper.
 * Keeps the connection typed & reusable for tests.
 */
import mongoose, { ConnectOptions, Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI = '' } = process.env;
if (!MONGO_URI) {
  throw new Error('❌  MONGO_URI not set in environment variables');
}

export const connectDB = async (): Promise<Connection> => {
  await mongoose.connect(MONGO_URI, {
    // NOTE: Most useful opts already default true in Mongoose ≥ 6
    autoIndex: true
  } as ConnectOptions);

  mongoose.connection.on('connected', () =>
    console.warn(`MongoDB connected: ${mongoose.connection.host}`)
  );
  mongoose.connection.on('error', (err) => console.error(`MongoDB error → ${err}`));

  return mongoose.connection;
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
};