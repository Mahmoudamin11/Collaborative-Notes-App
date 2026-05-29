import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

export class TokenService {
  private static ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
  private static REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" });
  }
}
