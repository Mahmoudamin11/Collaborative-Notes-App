import { Request, Response } from "express";
import AuthService from "@services/auth.service";
import { LoginInput, RegisterInput } from "@validators/auth.schema";
import { sendResponse } from "@/utils/sendResponse";

class AuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const userData: RegisterInput = req.body;
    const user = await this.authService.register(userData);
    sendResponse(res, 201, "User registered successfully", user);
  };

  login = async (req: Request, res: Response) => {
    const userData: LoginInput = req.body;

    const { accessToken, refreshToken, user } =
      await this.authService.login(userData);

    // Set the Refresh Token in a highly secure, HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents XSS scripts from reading the token
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    sendResponse(res, 200, "User logged in successfully", {
      ...user,
      accessToken,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await this.authService.refresh(refreshToken);
    sendResponse(res, 200, "Token refreshed successfully", accessToken);
  };
}

export default new AuthController();
