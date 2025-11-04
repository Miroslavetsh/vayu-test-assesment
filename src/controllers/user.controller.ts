import { Request, Response } from "express";
import { userService } from "@services/user.service";
import { sendSuccess } from "@lib/utils/apiResponse";
import { ApiSuccessResponse } from "@lib/types";

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      sendSuccess(res, users);
    } catch (error) {
      throw error;
    }
  }

  async getAllPaginated(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = res.locals.pagination;
      const result = await userService.getAllPaginated(limit, offset);
      const response: ApiSuccessResponse<typeof result> = {
        success: true,
        data: result,
      };
      res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  }

  async removeFromGroup(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const groupId = parseInt(req.params.groupId);

      if (isNaN(userId) || isNaN(groupId)) {
        throw new Error("Invalid user ID or group ID");
      }

      await userService.removeFromGroup(userId, groupId);
      sendSuccess(
        res,
        { message: "User removed from group successfully" },
        200
      );
    } catch (error) {
      throw error;
    }
  }

  async updateStatuses(req: Request, res: Response): Promise<void> {
    try {
      const { updates } = req.body;
      const result = await userService.updateStatuses(updates);
      sendSuccess(res, result, 200);
    } catch (error) {
      throw error;
    }
  }
}

export const userController = new UserController();
