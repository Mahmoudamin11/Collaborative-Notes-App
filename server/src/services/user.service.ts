import User from "@db/models/User";
import { CreateUserInput } from "@customTypes/user.types";

class UserService {
  async findByEmail(email: string, includePassword = false) {
    return await User.findByEmail(email, includePassword);
  }
  async findById(id: string) {
    return await User.findById(id);
  }
  async create(user: CreateUserInput) {
    return User.create(user);
  }
}

export default UserService;
