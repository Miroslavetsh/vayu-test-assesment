import { Request, Response } from "express";
import { userService } from "@services/user.service";
import { sendSuccess, sendError } from "@lib/utils/apiResponse";
import { ApiSuccessResponse } from "@lib/types";
import { MAX_BATCH_UPDATE_SIZE } from "@/lib/constants";

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      sendSuccess(res, users);
    } catch (error) {
      sendError(
        res,
        error instanceof Error ? error.message : "Unknown error",
        500
      );
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
      sendError(
        res,
        error instanceof Error ? error.message : "Unknown error",
        500
      );
    }
  }

  async removeFromGroup(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const groupId = parseInt(req.params.groupId);

      if (isNaN(userId) || isNaN(groupId)) {
        return sendError(res, "Invalid user ID or group ID", 400);
      }

      await userService.removeFromGroup(userId, groupId);
      sendSuccess(
        res,
        { message: "User removed from group successfully" },
        200
      );
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : error instanceof Error && error.message.includes("not a member")
          ? 400
          : 500;
      sendError(
        res,
        error instanceof Error ? error.message : "Unknown error",
        statusCode
      );
    }
  }

  async updateStatuses(req: Request, res: Response): Promise<void> {
    try {
      const { updates } = req.body;

      if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return sendError(
          res,
          "Updates array is required and must not be empty",
          400
        );
      }

      if (updates.length > MAX_BATCH_UPDATE_SIZE) {
        return sendError(
          res,
          `Maximum ${MAX_BATCH_UPDATE_SIZE} users can be updated at once`,
          400
        );
      }

      const result = await userService.updateStatuses(updates);
      sendSuccess(res, result, 200);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("Maximum")
          ? 400
          : error instanceof Error && error.message.includes("not found")
          ? 404
          : error instanceof Error && error.message.includes("Invalid")
          ? 400
          : error instanceof Error && error.message.includes("Duplicate")
          ? 400
          : 500;
      sendError(
        res,
        error instanceof Error ? error.message : "Unknown error",
        statusCode
      );
    }
  }
}

export const userController = new UserController();
