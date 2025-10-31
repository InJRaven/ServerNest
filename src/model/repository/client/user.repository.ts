import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '@/model/entity';

@Injectable()
class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    try {
      return await this.repository.findOne({ where: { username } });
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create({ id: uuidv4(), ...data });
    return await this.repository.save(user);
  }

  async updateUser(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
export { UserRepository };
