import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { setupDocs } from "./config/swagger";
import { ResponseUtil } from "./utils/response.util";

const app = express();

// ✅ Proper CORS setup for credentials
app.use(
  cors({
    origin: ["http://localhost:3000", "https://driver-sys.vercel.app"], // explicitly allow frontend origin
    credentials: true, // allow cookies or auth headers
  })
);

app.use(json());
app.use(morgan("dev"));

app.use("/api", routes);

setupDocs(app);

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  ResponseUtil.error(res, message, status);
});

// 404 handler
app.use((req, res) => {
  ResponseUtil.error(res as any, "Not Found", 404);
});

export default app;
