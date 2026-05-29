import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

/**
 * Validation middleware factory
 * Takes a Zod schema and returns Express middleware
 * Validates request body against the schema
 */
export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Pass ONLY req.body if your schema is validating the body fields directly
    const result = await schema.safeParseAsync(req.body);

    // 2. Explicitly check if validation failed
    if (!result.success) {
      return next(result.error); // Hand the ZodError over to the global error handler
    }

    // 3. Optional Best Practice: Replace req.body with the sanitized, stripped Zod data
    req.body = result.data;

    next();
  };
