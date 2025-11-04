import { Request, Response, NextFunction } from "express";
import { sendError } from "@lib/utils/apiResponse";

export function exceptionFilter(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) return next(err);

  if (!(err instanceof Error)) {
    return sendError(res, "Unknown error occurred", 500);
  }

  console.error("Error:", err.message, err.stack);

  let statusCode = 500;
  let message = "Internal server error";

  const errorMessage = err.message.toLowerCase();

  if (errorMessage.includes("not found")) {
    statusCode = 404;
    message = err.message;
  } else if (
    errorMessage.includes("invalid") ||
    errorMessage.includes("duplicate") ||
    errorMessage.includes("maximum") ||
    errorMessage.includes("required") ||
    errorMessage.includes("not a member")
  ) {
    statusCode = 400;
    message = err.message;
  } else {
    if (process.env.NODE_ENV === "development") {
      message = err.message;
    }
  }

  sendError(res, message, statusCode);
}
