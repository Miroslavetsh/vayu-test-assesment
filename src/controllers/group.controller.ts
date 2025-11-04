import { Request, Response } from "express";
import { groupService } from "../services/group.service";
import { sendSuccess, sendError } from "../lib/utils/apiResponse";
import { ApiSuccessResponse } from "../lib/types";

export class GroupController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const groups = await groupService.getAll();
      sendSuccess(res, groups);
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
      const result = await groupService.getAllPaginated(limit, offset);
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

export const groupController = new GroupController();
