import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AlbumsEntity } from '@entities';

@Injectable()
class AlbumsRepository {
  constructor(
    @InjectRepository(AlbumsEntity)
    private readonly repository: Repository<AlbumsEntity>,
  ) {}

  async createAlbum(data: Partial<AlbumsEntity>): Promise<AlbumsEntity> {
    try {
      const album = this.repository.create({ id: uuidv4(), ...data });
      return await this.repository.save(album);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Album already exists`);
      }
      if (error.code === '23503') {
        throw new BadRequestException('Artist not found');
      }
      throw error;
    }
  }

  async updateAlbum(
    id: string,
    data: Partial<AlbumsEntity>,
  ): Promise<AlbumsEntity | null> {
    try {
      const result = await this.repository.update(id, data);
      if (result.affected === 0) {
        return null;
      }

      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Album already exists`);
      }
      if (error.code === '23503') {
        throw new BadRequestException('Artist not found');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['artist', 'songs'],
    });
  }

  async findByArtistId(artistId: string): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { artist_id: artistId },
      order: { release_date: 'DESC' },
    });
  }

  async findByArtistIdWithSongs(artistId: string): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { artist_id: artistId },
      relations: ['songs'],
      order: { release_date: 'DESC' },
    });
  }

  async findAll(): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      relations: ['artist'],
      order: { release_date: 'DESC' },
    });
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByArtistId(artistId: string): Promise<number> {
    return await this.repository.count({
      where: { artist_id: artistId },
    });
  }

  async searchByTitle(searchTerm: string): Promise<AlbumsEntity[]> {
    return await this.repository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('album.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('album.release_date', 'DESC')
      .getMany();
  }

  async findByYear(year: number): Promise<AlbumsEntity[]> {
    return await this.repository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('EXTRACT(YEAR FROM album.release_date) = :year', { year })
      .orderBy('album.release_date', 'DESC')
      .getMany();
  }
}
export { AlbumsRepository };
