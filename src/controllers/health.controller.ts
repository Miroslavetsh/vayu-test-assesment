import { Request, Response } from "express";
import { healthService } from "@services/health.service";
import { sendSuccess } from "@lib/utils/apiResponse";

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await healthService.getHealth();
      sendSuccess(res, health);
    } catch (error) {
      throw error;
    }
  }
}

export const healthController = new HealthController();
