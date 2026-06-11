import Fastify from "fastify";
import { registerSecurity } from "./plugins/security.js";
import { registerSwagger, registerSwaggerUi } from "./plugins/swagger.js";
import { healthRoutes } from "./routes/health.js";
import { itemRoutes } from "./routes/items.js";

export async function buildServer() {
  const app = Fastify({ logger: true });

  // 1. Security (cors, helmet) — before everything
  await registerSecurity(app);

  // 2. Swagger schema collection — BEFORE routes
  await registerSwagger(app);

  // 3. Routes
  await app.register(healthRoutes);
  await app.register(itemRoutes, { prefix: "/api/v1" });

  // 4. Swagger UI — AFTER routes so all schemas are captured
  await registerSwaggerUi(app);

  return app;
}
