import { Request, Response } from "express";
import AuthService from "@services/auth.service";
import { LoginInput, RegisterInput } from "@validators/auth.schema";
import { sendResponse } from "@/utils/sendResponse";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

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

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    sendResponse(res, 200, "User logged in successfully", {
      ...user,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await this.authService.refresh(refreshToken);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    sendResponse(res, 200, "Token refreshed successfully", null);
  };
}

export default new AuthController();
