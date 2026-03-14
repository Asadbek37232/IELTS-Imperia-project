import 'dotenv/config';
import http from 'http';
import app from './app';
import { initSocket } from './socket/socketHandler';
import prisma from './config/database';
import { ENV } from './config/env';

const server = http.createServer(app);
initSocket(server);

async function main() {
  await prisma.$connect();
  console.log('[DB] Connected to PostgreSQL');

  server.listen(ENV.PORT, () => {
    console.log(`[Server] Running on http://localhost:${ENV.PORT}`);
    console.log(`[Server] Environment: ${ENV.NODE_ENV}`);
  });
}

main().catch(err => {
  console.error('[Server] Fatal error:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
