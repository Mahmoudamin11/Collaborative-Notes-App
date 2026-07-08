import UnauthenticatedError from "@/errors/unauthenticated";
import { TokenService } from "@/services/token.service";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";



export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new UnauthenticatedError("Not authenticated");
  }

  const payload = TokenService.verifyAccessToken(token);

  req.user = payload;

  next();
};
