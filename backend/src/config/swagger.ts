import { Express, Request, Response } from "express";

// Hand-written OpenAPI JSON document describing the main endpoints in this
// project. This keeps documentation local and avoids pulling in the vulnerable
// transitive dependency chain from swagger-jsdoc / swagger-parser.
const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Driver System API",
    version: "1.0.0",
    description: "API for driver records, documents and verifications",
  },
  servers: [{ url: "/api", description: "Local API root" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Error: { 
        type: "object", 
        properties: { 
          success: { type: "boolean", default: false },
          message: { type: "string" } 
        } 
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", default: true },
          message: { type: "string" },
          data: { type: "object" }
        }
      },
      AuthLogin: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ["username", "password"],
      },
      AuthResponse: {
        type: "object",
        properties: { 
          token: { type: "string" }, 
          user: { 
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              role: { type: "string" }
            }
          } 
        },
      },
      User: {
        type: "object",
        properties: { 
          id: { type: "string" }, 
          username: { type: "string" }, 
          role: { type: "string" } 
        },
      },
      Driver: {
        type: "object",
        properties: {
          id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          phoneNumber: { type: "string" },
          qrCode: { type: "string" },
        },
      },
      Document: {
        type: "object",
        properties: {
          id: { type: "string" },
          documentNumber: { type: "string" },
          type: { type: "string" },
          expiryDate: { type: "string", format: "date" },
          status: { type: "string" },
          driverId: { type: "string" },
        },
      },
      VerificationLog: {
        type: "object",
        properties: {
          id: { type: "string" },
          documentId: { type: "string" },
          driverId: { type: "string" },
          officerId: { type: "string" },
          result: { type: "string", enum: ["VALID", "INVALID", "EXPIRED", "FORGED"] },
          notes: { type: "string" },
          location: { type: "string" },
          ipAddress: { type: "string" },
          userAgent: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        }
      },
      Pagination: {
        type: "object",
        properties: { 
          page: { type: "integer" }, 
          limit: { type: "integer" }, 
          total: { type: "integer" } 
        },
      },
    },
    parameters: {
      PageParam: { 
        name: "page", 
        in: "query", 
        schema: { type: "integer", default: 1, minimum: 1 } 
      },
      LimitParam: { 
        name: "limit", 
        in: "query", 
        schema: { type: "integer", default: 20, minimum: 1, maximum: 100 } 
      },
      DaysParam: { 
        name: "days", 
        in: "query", 
        schema: { type: "integer", default: 30, minimum: 1 } 
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication token is missing or invalid",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" }
          }
        }
      },
      ForbiddenError: {
        description: "User doesn't have permission to access this resource",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" }
          }
        }
      },
      NotFoundError: {
        description: "The requested resource was not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" }
          }
        }
      },
      ValidationError: {
        description: "Invalid request data",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" }
          }
        }
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        summary: "User login",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLogin" } } } },
        responses: { "200": { description: "Auth success", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, "401": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } } },
      },
    },
    "/auth/register": {
      post: { summary: "Register user", requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "201": { description: "Created" } } },
    },
    "/auth/refresh": {
      post: { summary: "Refresh token", requestBody: { content: { "application/json": { schema: { type: "object", properties: { refreshToken: { type: "string" } } } } } }, responses: { "200": { description: "Token refreshed" } } },
    },

    "/drivers": {
      post: { summary: "Create driver", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Driver" } } } }, responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Driver" } } } } } },
      get: { summary: "List drivers", parameters: [{ $ref: "#/components/parameters/PageParam" }, { $ref: "#/components/parameters/LimitParam" }], responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { drivers: { type: "array", items: { $ref: "#/components/schemas/Driver" } }, pagination: { $ref: "#/components/schemas/Pagination" } } } } } } } },
    },
    "/drivers/search": {
      get: { summary: "Search drivers", parameters: [{ name: "q", in: "query", schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
    },
    "/drivers/{id}": {
      get: { summary: "Get driver by id", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Driver" } } } }, "404": { description: "Not found" } } },
      put: { summary: "Update driver", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated" } } },
      delete: { summary: "Deactivate driver", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Deactivated" } } },
    },

    "/documents": {
      post: { summary: "Create document", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Document" } } } }, responses: { "201": { description: "Created" } } },
    },
    "/documents/expiring": {
      get: { 
        summary: "Get expiring documents", 
        parameters: [{ $ref: "#/components/parameters/DaysParam" }], 
        responses: { 
          "200": { 
            description: "OK", 
            content: { 
              "application/json": { 
                schema: { 
                  type: "array", 
                  items: { $ref: "#/components/schemas/Document" } 
                } 
              } 
            } 
          } 
        } 
      }
    },
    "/documents/driver/{driverId}": {
      get: { summary: "Documents for driver", parameters: [{ name: "driverId", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
    },
    "/documents/number/{documentNumber}": {
      get: { summary: "Get document by number", parameters: [{ name: "documentNumber", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
    },
    "/documents/{id}": {
      get: { summary: "Get document by id", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      put: { summary: "Update document", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated" } } },
    },
    "/documents/{id}/status": {
      put: { summary: "Update document status", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { status: { type: "string" } } } } } }, responses: { "200": { description: "Status updated" } } },
    },

    "/verifications/verify": {
      post: { summary: "Verify driver (by body)", requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Verification result" } } },
    },
    "/verifications/verify/qrcode": {
      post: { summary: "Verify by QR code", requestBody: { content: { "application/json": { schema: { type: "object", properties: { qrCodeData: { type: "string" } } } } } }, responses: { "200": { description: "Verification result" } } },
    },
    "/verifications/verify/document": {
      post: { summary: "Verify by document number", requestBody: { content: { "application/json": { schema: { type: "object", properties: { documentNumber: { type: "string" } } } } } }, responses: { "200": { description: "Verification result" } } },
    },
    "/verifications/history": {
      get: { summary: "Officer verification history", parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 50 } }], responses: { "200": { description: "OK" } } },
    },
    "/verifications/driver/{driverId}": {
      get: { summary: "Driver verification history", parameters: [{ name: "driverId", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
    },
    "/verifications/stats/officer": {
      get: { summary: "Officer stats", parameters: [{ $ref: "#/components/parameters/DaysParam" }], responses: { "200": { description: "OK" } } },
    },
    "/verifications/stats/system": {
      get: { summary: "System stats", parameters: [{ $ref: "#/components/parameters/DaysParam" }], responses: { "200": { description: "OK" } } },
    },

    "/dashboard": {
      get: { summary: "Get dashboard data", responses: { "200": { description: "OK" } } },
    },
  },
};

export function setupDocs(app: Express) {
  // Serve OpenAPI JSON
  app.get("/openapi.json", (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  // Serve ReDoc single-file HTML pointing at /openapi.json. ReDoc has no
  // vulnerable dependency here because we serve the static client from CDN.
  app.get("/docs", (_req: Request, res: Response) => {
    res.send(`<!doctype html>
      <html>
        <head>
          <title>API Docs</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>body { margin: 0; padding: 0; }</style>
        </head>
        <body>
          <redoc spec-url='/openapi.json'></redoc>
          <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    `);
  });
}
