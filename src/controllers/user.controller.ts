import { Request, Response } from "express";
import { userService } from "../services/user.service";

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
}

export const userController = new UserController();
