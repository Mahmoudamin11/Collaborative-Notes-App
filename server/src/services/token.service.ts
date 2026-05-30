import UnauthenticatedError from "@/errors/unauthenticated";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenPayload {
  userId: Types.ObjectId;
  email: string;
}

export class TokenService {
  private static ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || "access_secret";
  private static REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "refresh_secret";

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" });
  }

  static verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    } catch {
      throw new UnauthenticatedError("Invalid refresh token");
    }
  }
}
