import { getRepository } from "typeorm";
import { User } from "orm/entities/users/User";
import { CustomError } from "utils/response/custom-error/CustomError";

class UserService {
  private userRepository = getRepository(User);

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`);
    }
    return user;
  }

  async create(userData: { username: string; email: string; password: string; name: string; role: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<{ username: string; name: string; email: string; password: string; role: string }>): Promise<User | undefined> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`);
    }
    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new CustomError(404, 'General', `User with id:${id} not found after update.`);
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`);
    }
    await this.userRepository.remove(user);
  }
}

export default UserService;
