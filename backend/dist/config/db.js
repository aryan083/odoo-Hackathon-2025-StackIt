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
 * MongoDB connection helper.
 * Keeps the connection typed & reusable for tests.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const { MONGO_URI = '' } = process.env;
if (!MONGO_URI) {
    throw new Error('❌  MONGO_URI not set in environment variables');
}
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connect(MONGO_URI, {
        // NOTE: Most useful opts already default true in Mongoose ≥ 6
        autoIndex: true
    });
    mongoose.connection.on('connected', () => console.warn(`MongoDB connected: ${mongoose.connection.host}`));
    mongoose.connection.on('error', (err) => console.error(`MongoDB error → ${err}`));
    return mongoose.connection;
});
export const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connection.close();
});
