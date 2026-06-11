import type { FastifyInstance } from "fastify";

interface Item {
  id: string;
  name: string;
  createdAt: string;
}

// In-memory store — replace with your DB of choice
const store = new Map<string, Item>();

const ItemSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    createdAt: { type: "string" },
  },
  required: ["id", "name", "createdAt"],
} as const;

export async function itemRoutes(app: FastifyInstance) {
  // GET /items — list all
  app.get(
    "/items",
    {
      schema: {
        tags: ["items"],
        summary: "List all items",
        response: { 200: { type: "array", items: ItemSchema } },
      },
    },
    async () => Array.from(store.values())
  );

  // GET /items/:id
  app.get<{ Params: { id: string } }>(
    "/items/:id",
    {
      schema: {
        tags: ["items"],
        summary: "Get item by ID",
        params: { type: "object", properties: { id: { type: "string" } } },
        response: {
          200: ItemSchema,
          404: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (req, reply) => {
      const item = store.get(req.params.id);
      if (!item) return reply.status(404).send({ error: "Item not found" });
      return item;
    }
  );

  // POST /items
  app.post<{ Body: { name: string } }>(
    "/items",
    {
      schema: {
        tags: ["items"],
        summary: "Create an item",
        body: {
          type: "object",
          required: ["name"],
          properties: { name: { type: "string", minLength: 1 } },
        },
        response: { 201: ItemSchema },
      },
    },
    async (req, reply) => {
      const id = crypto.randomUUID();
      const item: Item = { id, name: req.body.name, createdAt: new Date().toISOString() };
      store.set(id, item);
      return reply.status(201).send(item);
    }
  );

  // DELETE /items/:id
  app.delete<{ Params: { id: string } }>(
    "/items/:id",
    {
      schema: {
        tags: ["items"],
        summary: "Delete an item",
        params: { type: "object", properties: { id: { type: "string" } } },
        response: {
          204: { type: "null" },
          404: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (req, reply) => {
      if (!store.delete(req.params.id)) {
        return reply.status(404).send({ error: "Item not found" });
      }
      return reply.status(204).send();
    }
  );
}
