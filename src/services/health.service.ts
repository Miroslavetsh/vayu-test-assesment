import { HealthResponse } from "@models/health.model";
import { testConnection } from "@config/database";

class HealthService {
  async getHealth(): Promise<HealthResponse> {
    await testConnection();

    return {
      status: "ok",
      message: "Server is running and database connected",
      timestamp: new Date(),
    };
  }
}

export const healthService = new HealthService();
