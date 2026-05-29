import User from "@db/models/User";
import { CreateUserInput } from "@customTypes/user.types";

class UserService {
  async findByEmail(email: string, includePassword = false) {
    return User.findByEmail(email, includePassword);
  }

  async create(user: CreateUserInput) {
    return User.create(user);
  }
}

export default UserService;
