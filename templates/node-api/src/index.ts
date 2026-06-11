import { buildServer } from "./server.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = "0.0.0.0"; // Bind to all interfaces — required in containers

async function main() {
  const app = await buildServer();
  try {
    await app.listen({ port: PORT, host: HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
