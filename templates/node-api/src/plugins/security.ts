import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

export async function registerSecurity(app: FastifyInstance) {
  const origin = process.env.CORS_ORIGIN ?? "*";

  await app.register(cors, {
    origin: origin === "*" ? true : origin.split(",").map((o) => o.trim()),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });

  await app.register(helmet, {
    // Disable CSP for Swagger UI to work out of the box
    contentSecurityPolicy: false,
  });
}
