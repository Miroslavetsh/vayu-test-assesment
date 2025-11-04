import { Request } from "express";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../constants";
import { PaginationParams, PaginationValidationResult } from "../types";

export function parsePaginationParams(
  req: Request
): PaginationValidationResult {
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const offset = parseInt(req.query.offset as string) || DEFAULT_OFFSET;

  if (limit < 1 || offset < 0) {
    return {
      isValid: false,
      error: "Limit must be greater than 0 and offset must be non-negative",
    };
  }

  return {
    isValid: true,
    params: {
      limit,
      offset,
    },
  };
}
