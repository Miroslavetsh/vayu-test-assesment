import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { testConnection } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await testConnection();
    res.json({
      status: "ok",
      message: "Server is running, MySQL connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "Express + TypeScript server is running!",
    endpoints: {
      health: "/health",
      root: "/",
    },
  });
});

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Mode: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
