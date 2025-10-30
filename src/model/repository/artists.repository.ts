import { ArtistsEnity } from '@/model/entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class ArtistsRepository {
  constructor(
    @InjectRepository(ArtistsEnity)
    private readonly repository: Repository<ArtistsEnity>,
  ) {}

  async createArtist(data: Partial<ArtistsEnity>): Promise<ArtistsEnity> {
    try {
      const artist = this.repository.create({ id: uuidv4(), ...data });
      return await this.repository.save(artist);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Artist already exists`);
      }
      throw error;
    }
  }

  async updateArtist(
    id: string,
    data: Partial<ArtistsEnity>,
  ): Promise<ArtistsEnity | null> {
    try {
      const result = await this.repository.update(id, data);
      if (result.affected === 0) {
        return null;
      }
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Artist already exists`);
      }
      throw error;
    }
  }
  async findById(id: string): Promise<ArtistsEnity | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding artist by id:', error);
      return null;
    }
  }

  async findAll(): Promise<ArtistsEnity[]> {
    return await this.repository.find();
  }

  async findAllWithAlbums(): Promise<ArtistsEnity[]> {
    return await this.repository.find({
      relations: ['Albums'],
      order: { name: 'ASC' },
    });
  }
  async deleteArtist(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
  async count(): Promise<number> {
    return await this.repository.count();
  }

  async searchByName(searchTerm: string): Promise<ArtistsEnity[]> {
    return await this.repository
      .createQueryBuilder('artist')
      .where('artist.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('artist.name', 'ASC')
      .getMany();
  }
}
export { ArtistsRepository };
