import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEnity } from '../entity/user.enity';

@Injectable()
class UserRepository {
  constructor(
    @InjectRepository(UserEnity)
    private readonly userRepository: Repository<UserEnity>,
  ) {}

  async findByEmail(email: string): Promise<UserEnity | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findByUsername(username: string): Promise<UserEnity | null> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  async createUser(data: Partial<UserEnity>): Promise<UserEnity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async updateUser(
    id: string,
    data: Partial<UserEnity>,
  ): Promise<UserEnity | null> {
    await this.userRepository.update(id, data);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
export { UserRepository };
