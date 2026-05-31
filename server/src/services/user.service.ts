import UserRepository from "@/repositories/user.repo";
import { CreateUserInput } from "@customTypes/user.types";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findByEmail(email: string, includePassword = false) {
    return this.userRepository.findByEmail(email, includePassword);
  }
  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async create(user: CreateUserInput) {
    return this.userRepository.create(user);
  }
}

export default UserService;
