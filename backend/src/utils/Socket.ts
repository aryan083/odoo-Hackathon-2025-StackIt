import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { redisClient } from '../config/redis.ts';

/*
 * Socket.IO bootstrap & helpers
 * ---------------------------------------------------------------------------
 * This utility exports a single `initSocket` function that you call once
 * after creating your HTTP server (`src/index.ts`). It returns the `io`
 * instance so you can import it elsewhere if needed (for emitting events
 * from REST controllers, etc.).
 *
 * Design decisions:
 * 1. JWT authentication over Socket.IO: the client provides a JWT in
 *    `socket.handshake.auth.token` (preferred) or as a query string.
 * 2. Each connected user automatically joins a personal room `user:<id>` to
 *    make it easy to push notifications.
 * 3. Question pages can join `question:<qid>` rooms for real-time updates
 *    (new answers, votes, etc.).
 * 4. Redis adapter is optional. If Redis is connected, we install the
 *    `@socket.io/redis-adapter` so multiple node processes can broadcast.
 */

dotenv.config();

let io: IOServer | undefined;

export const getIO = (): IOServer => {
  if (!io) throw new Error('❌ Socket.io not initialised yet');
  return io;
};

export const initSocket = (server: HTTPServer): IOServer => {
  if (io) return io; // singleton guard

  io = new IOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    },
  });

  // Optional Redis pub/sub adapter — only if redisClient connected.
  try {
    // Dynamically import to avoid hard dep if adapter not installed.
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const { createAdapter } = require('@socket.io/redis-adapter');
    const subClient = redisClient.duplicate();
    redisClient.connect().catch(() => {});
    subClient.connect().catch(() => {});
    io.adapter(createAdapter(redisClient, subClient));
    console.info('Socket.IO is using Redis adapter');
  } catch (err) {
    console.warn('Redis adapter not in use (package missing?)');
  }

  /* -------------------------- Auth middleware --------------------------- */
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ?? (socket.handshake.query.token as string);
    if (!token) return next(new Error('Authentication token required'));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
        sub: string;
        role: string;
      };
      (socket as any).user = { id: payload.sub, role: payload.role }; // attach
      return next();
    } catch (e) {
      return next(new Error('Invalid token'));
    }
  });

  /* ------------------------------ Handlers ------------------------------ */
  io.on('connection', (socket: Socket) => {
    const { id: userId } = (socket as any).user as { id: string };
    // personal room
    socket.join(`user:${userId}`);

    socket.on('joinQuestion', (questionId: string) => {
      socket.join(`question:${questionId}`);
    });

    socket.on('leaveQuestion', (questionId: string) => {
      socket.leave(`question:${questionId}`);
    });

    socket.on('disconnect', () => {
      // any cleanup if necessary
    });
  });

  return io;
};

/* -----------------------------------------------------------------------
 * Helper emitters (can be imported in controllers)
 * --------------------------------------------------------------------- */
export const emitToUser = (userId: string, event: string, payload: unknown): void => {
  getIO().to(`user:${userId}`).emit(event, payload);
};

export const emitToQuestion = (
  questionId: string,
  event: string,
  payload: unknown,
): void => {
  getIO().to(`question:${questionId}`).emit(event, payload);
};
