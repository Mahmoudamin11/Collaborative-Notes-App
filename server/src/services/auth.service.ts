import { LoginInput, RegisterInput } from "@validators/auth.schema";
import UserService from "./user.service";
import BadRequestError from "@errors/bad-request";
import UnauthenticatedError from "@/errors/unauthenticated";

class AuthService {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async register(userData: RegisterInput) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError("Email already registered");
    }

    const user = await this.userService.create({
      ...userData,
      accounts: [
        {
          provider: "credentials",
          providerAccountId: userData.email,
          type: "credentials",
        },
      ],
    });
    return user;
  }

  async login(userData: LoginInput) {
    const { email, password } = userData;
    // const user = await this.userService.findByEmail(email);
    const user = await this.userService.findByEmail(email, true); 
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    // TODO : handle generate the token & return it with the user

    return user;
  }
}

export default AuthService;
