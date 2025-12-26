import swaggerJSDoc from "swagger-jsdoc";

export function getSwaggerSpec() {
  const port = process.env.PORT ?? "3000";

  return swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Psychology Website API",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${port}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Use: Authorization: Bearer <token>",
          },
        },
        schemas: {
          Article: {
            type: "object",
            additionalProperties: false,
            required: [
              "id",
              "title",
              "summary",
              "image",
              "status",
              "tags",
              "value",
              "html",
              "createdAt",
              "updatedAt",
            ],
            properties: {
              id: { type: "string", format: "uuid" },
              title: { type: "string" },
              summary: { type: "string" },
              image: { type: ["string", "null"] },
              status: { type: "string", enum: ["draft", "published"] },
              tags: { type: "array", items: { type: "string" }, description: "Tag names only" },
              value: { type: "array", items: {} },
              html: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          Tag: {
            type: "object",
            additionalProperties: false,
            required: ["id", "name", "createdAt"],
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              createdAt: { type: "string" },
            },
          },
          PaginationResponse: {
            type: "object",
            additionalProperties: false,
            required: ["items", "page", "limit", "totalItems", "totalPages"],
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/Article" } },
              page: { type: "number" },
              limit: { type: "number" },
              totalItems: { type: "number" },
              totalPages: { type: "number" },
            },
          },
          ErrorResponse: {
            type: "object",
            additionalProperties: false,
            required: ["error"],
            properties: {
              error: {
                type: "object",
                additionalProperties: false,
                required: ["message"],
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
          AdminLoginRequest: {
            type: "object",
            additionalProperties: false,
            required: ["email", "password"],
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string" },
            },
          },
          AdminLoginResponse: {
            type: "object",
            additionalProperties: false,
            required: ["token"],
            properties: {
              token: { type: "string" },
            },
          },
          ArticleUpsertRequest: {
            type: "object",
            additionalProperties: false,
            required: ["title", "summary", "image", "status", "value", "html", "tagIds"],
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              image: { type: ["string", "null"] },
              status: { type: "string", enum: ["draft", "published"] },
              value: { type: "array", items: {} },
              html: { type: "string" },
              tagIds: { type: "array", items: { type: "string", format: "uuid" } },
            },
          },
          TagUpsertRequest: {
            type: "object",
            additionalProperties: false,
            required: ["name"],
            properties: {
              name: { type: "string" },
            },
          },
        },
      },
    },
    apis: ["src/routes/*.ts"],
  });
}

