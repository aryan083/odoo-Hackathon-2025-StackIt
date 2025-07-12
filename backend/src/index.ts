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

  // Handle common startup errors (e.g. port already in use)
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌  Port ${PORT} is already in use. Set PORT env variable to a different value or free the port.`);
    } else {
      console.error('❌  Server failed to start:', err);
    }
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
