import app from './app';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Inventory API listening on port ${port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(() => {
    process.exit(0);
  });
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
