import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { setupDocs } from "./config/swagger";
import { ResponseUtil } from "./utils/response.util";

const app = express();

app.use(json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", routes);

setupDocs(app);

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  ResponseUtil.error(res, message, status);
});

// 404
app.use((req, res) => {
  ResponseUtil.error(res as any, "Not Found", 404);
});

export default app;
