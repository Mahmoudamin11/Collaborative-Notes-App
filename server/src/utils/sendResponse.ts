import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T | null;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
): Response => {
  const responsePayload: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(responsePayload);
};
