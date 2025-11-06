import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AdminEntity } from '@entities';

@Injectable()
class AdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly repository: Repository<AdminEntity>,
  ) {}

  async createAdmin(data: Partial<AdminEntity>): Promise<AdminEntity> {
    const admin = this.repository.create({ id: uuidv4(), ...data });
    return await this.repository.save(admin);
  }

  async updateAdmin(
    id: string,
    data: Partial<AdminEntity>,
  ): Promise<AdminEntity | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async deleteAdmin(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async findById(id: string): Promise<AdminEntity | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding admin by id:', error);
      return null;
    }
  }
  async findByEmail(email: string): Promise<AdminEntity | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding admin by email:', error);
      return null;
    }
  }

  async findByName(username: string): Promise<AdminEntity | null> {
    try {
      return await this.repository.findOne({ where: { username } });
    } catch (error) {
      console.error('Error finding admin by name:', error);
      return null;
    }
  }
}
export { AdminRepository };
