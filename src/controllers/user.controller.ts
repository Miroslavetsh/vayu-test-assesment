import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../lib/constants";

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAllPaginated(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
      const offset = parseInt(req.query.offset as string) || DEFAULT_OFFSET;

      if (limit < 1 || offset < 0) {
        res.status(400).json({
          success: false,
          error: "Limit must be greater than 0 and offset must be non-negative",
        });
        return;
      }

      const result = await userService.getAllPaginated(limit, offset);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const userController = new UserController();
