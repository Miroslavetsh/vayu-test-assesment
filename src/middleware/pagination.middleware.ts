import { Request, Response, NextFunction } from "express";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@lib/constants";
import { PaginationParams } from "@lib/types";

export function paginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const offset = parseInt(req.query.offset as string) || DEFAULT_OFFSET;

  if (limit < 1 || offset < 0) {
    res.status(400).json({
      success: false,
      error: "Limit must be greater than 0 and offset must be non-negative",
    });
    return;
  }

  res.locals.pagination = {
    limit,
    offset,
  } as PaginationParams;

  next();
}
