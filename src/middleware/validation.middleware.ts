import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";
import { sendError } from "@lib/utils/apiResponse";

export function validateBody(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        sendError(
          res,
          `Validation failed: ${errors.map((e) => e.message).join(", ")}`,
          400
        );
      } else {
        sendError(res, "Validation failed", 400);
      }
    }
  };
}
