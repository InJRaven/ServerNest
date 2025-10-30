import { GenresEnity } from '@/model/entity';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class GenresRepository {
  constructor(
    @InjectRepository(GenresEnity)
    private readonly repository: Repository<GenresEnity>,
  ) {}

  async createGenre(data: Partial<GenresEnity>): Promise<GenresEnity> {
    try {
      const genre = this.repository.create({ id: uuidv4(), ...data });
      return await this.repository.save(genre);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Genre already exists`);
      }
      throw error;
    }
  }

  async updateGenre(
    id: string,
    data: Partial<GenresEnity>,
  ): Promise<GenresEnity | null> {
    try {
      const result = await this.repository.update(id, data);
      if (result.affected === 0) {
        return null;
      }

      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Genre already exists`);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<GenresEnity | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding genre by id:', error);
      return null;
    }
  }

  async findByName(name: string): Promise<GenresEnity | null> {
    try {
      return await this.repository.findOne({ where: { name } });
    } catch (error) {
      console.error('Error finding genre by name:', error);
      return null;
    }
  }
  async findAll(): Promise<GenresEnity[]> {
    return await this.repository.find({
      order: { name: 'ASC' },
    });
  }
  async deleteGenre(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
export { GenresRepository };
