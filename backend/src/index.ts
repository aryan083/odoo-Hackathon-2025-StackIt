// src/index.ts
import http from 'http';
import dotenv from 'dotenv';

import app from './app.ts';
import { connectDB } from './config/db.ts';
import { initSocket } from './utils/Socket.ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
