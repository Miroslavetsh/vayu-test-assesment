import { Response } from "express";
import { ApiSuccessResponse, ApiErrorResponse } from "../types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 500
): void {
  const response: ApiErrorResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
}

