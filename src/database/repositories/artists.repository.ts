import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsEntity } from '@entities';

@Injectable()
class ArtistsRepository {
  constructor(
    @InjectRepository(ArtistsEntity)
    private readonly repository: Repository<ArtistsEntity>,
  ) {}

  async createArtist(data: Partial<ArtistsEntity>): Promise<ArtistsEntity> {
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
    data: Partial<ArtistsEntity>,
  ): Promise<ArtistsEntity | null> {
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
  async findById(id: string): Promise<ArtistsEntity | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding artist by id:', error);
      return null;
    }
  }

  async findAll(): Promise<ArtistsEntity[]> {
    return await this.repository.find();
  }

  async findAllWithAlbums(): Promise<ArtistsEntity[]> {
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

  async searchByName(searchTerm: string): Promise<ArtistsEntity[]> {
    return await this.repository
      .createQueryBuilder('artist')
      .where('artist.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('artist.name', 'ASC')
      .getMany();
  }
}
export { ArtistsRepository };
