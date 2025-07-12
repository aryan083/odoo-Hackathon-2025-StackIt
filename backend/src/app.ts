// src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.ts';
import userRoutes from './routes/user.ts';
import questionsRoutes from './routes/questions.ts';
import answersRoutes from './routes/answers.ts';

dotenv.config();

const app = express();

/* ---------- Core middleware ---------- */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

/* ---------- Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/questions/:qid/answers', answersRoutes);

/* ---------- 404 & error handler ---------- */
// Catch-all 404 handler (must be last)
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

export default app;
