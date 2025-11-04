import { Request, Response } from "express";
import { healthService } from "../services/health.service";

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await healthService.getHealth();
      res.status(200).json({
        success: true,
        data: health,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const healthController = new HealthController();
