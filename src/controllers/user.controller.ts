import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { parsePaginationParams } from "../lib/utils/parsePaginationParams";

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
      const paginationResult = parsePaginationParams(req);

      if (!paginationResult.isValid) {
        res.status(400).json({
          success: false,
          error: paginationResult.error,
        });
        return;
      }

      const { limit, offset } = paginationResult.params!;
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
