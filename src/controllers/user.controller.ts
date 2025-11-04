import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { sendSuccess, sendError } from "../lib/utils/apiResponse";
import { ApiSuccessResponse } from "../lib/types";

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
}

export const userController = new UserController();
