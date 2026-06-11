import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

/**
 * Registers @fastify/swagger BEFORE routes so all route schemas
 * are captured in the spec. @fastify/swagger-ui is registered last.
 */
export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "{{projectName}} API",
        description: "Scaffolded with create-platform-app",
        version: "0.1.0",
      },
      tags: [
        { name: "health", description: "Health check endpoints" },
        { name: "items", description: "Example CRUD resource" },
      ],
    },
  });
}

export async function registerSwaggerUi(app: FastifyInstance) {
  await app.register(swaggerUi, {
    routePrefix: "/documentation",
    uiConfig: { docExpansion: "list", deepLinking: false },
  });
}
