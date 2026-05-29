import CustomAPIError from "@/errors/custom-api";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

// 1. Define a strict blueprint for all API error responses
interface ErrorResponse {
  success: false;
  message: string;
  errors: Array<{ field: string | null; message: string }>;
}

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Default values 
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: ErrorResponse["errors"] = [];

  // Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Failed";
    
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."), 
      message: issue.message,
    }));
  }
  // Custom API Errors
  else if (err instanceof CustomAPIError) {
    statusCode = err.statusCode || 400;
    message = err.message;
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
