import 'dotenv/config';
import { createServer } from './server/index.js';

const port = process.env.PORT || 3000;

// createServer() applies schema migrations and hydrates state from Postgres ONCE
// at startup. Because this is a single long-running instance, there is exactly
// one in-memory copy and one writer — the split-brain / data-loss problem that
// serverless caused does not exist here.
const app = await createServer();

const server = app.listen(port, () => {
  console.log(`🚀 E-Waste API listening on port ${port}`);
});

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    console.log(`${sig} received — shutting down gracefully`);
    server.close(() => process.exit(0));
  });
}
