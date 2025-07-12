// src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.ts';
import userRoutes from './routes/user.ts';
import questionsRoutes from './routes/questions.ts';
import answersRoutes from './routes/answers.ts';
import notificationsRoutes from './routes/notifications.ts';
import tagsRoutes from './routes/tags.ts';
import adminRoutes from './routes/admin.ts';

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
app.use('/api/notifications', notificationsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/admin', adminRoutes);

/* ---------- 404 & error handler ---------- */
// Catch-all 404 handler (must be last)
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

// Generic error handler – ensures stack traces bubble during tests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Express error:', err);
  res.status(500).json({ message: 'Internal error', error: (err as Error).message, stack: (err as Error).stack });
});

export default app;
