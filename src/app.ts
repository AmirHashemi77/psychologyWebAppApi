import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { getSwaggerSpec } from "./docs/swagger";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/docs.json", (_req, res) => {
    res.json(getSwaggerSpec());
  });
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(getSwaggerSpec()));

  app.use("/api/admin", adminRouter);
  app.use("/api", publicRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
