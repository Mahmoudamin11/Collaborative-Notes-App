import BaseRepository from "@repositories/base.repo";
import User, { IUserDocument } from "@/db/models/User";

class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, includePassword = false) {
    return User.findByEmail(email, includePassword);
  }
}

export default UserRepository;
