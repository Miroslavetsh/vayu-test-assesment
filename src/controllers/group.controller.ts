import { Request, Response } from "express";
import { groupService } from "../services/group.service";

export class GroupController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const groups = await groupService.getAll();
      res.status(200).json({
        success: true,
        data: groups,
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
      const { limit, offset } = res.locals.pagination;
      const result = await groupService.getAllPaginated(limit, offset);
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

export const groupController = new GroupController();
