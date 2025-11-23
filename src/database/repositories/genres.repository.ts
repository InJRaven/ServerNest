import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { GenresEntity } from '@entities';
import { BaseRepository } from './base.repository';
interface IGenreRepository {
  findBySlug(slug: string): Promise<GenresEntity | null>;
  findByTitle(name: string): Promise<GenresEntity | null>;
  // searchGenres(
  //   options: IGenreSearchOptions,
  // ): Promise<IPaginatedResult<GenresEntity>>;
  getTopGenres(limit: number): Promise<GenresEntity[]>;
  getActiveGenres(): Promise<GenresEntity[]>;
  incrementTrackCount(id: string, count: number): Promise<void>;
  incrementAlbumCount(id: string, count: number): Promise<void>;
  updatePopularity(id: string, popularity: number): Promise<void>;
}
@Injectable()
class GenresRepository
  extends BaseRepository<GenresEntity>
  implements IGenreRepository
{
  constructor(
    @InjectRepository(GenresEntity)
    repository: Repository<GenresEntity>,
  ) {
    super(repository);
  }
  async findBySlug(slug: string): Promise<GenresEntity | null> {
    return await this.findOne({
      slug,
    } as any as FindOptionsWhere<GenresEntity>);
  }

  async findByTitle(title: string): Promise<GenresEntity | null> {
    return await this.findOne({
      title,
    } as any as FindOptionsWhere<GenresEntity>);
  }

  async getTopGenres(limit: number = 10): Promise<GenresEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        is_active: true,
      } as any as FindOptionsWhere<GenresEntity>,
      order: { popularity: 'DESC', track_count: 'DESC' },
      take: limit,
    });
  }
  async getActiveGenres(): Promise<GenresEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        is_active: true,
      } as any as FindOptionsWhere<GenresEntity>,
      order: { title: 'ASC' },
    });
  }

  async incrementTrackCount(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'track_count', count);
  }

  async incrementAlbumCount(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'album_count', count);
  }

  async updatePopularity(id: string, popularity: number): Promise<void> {
    await this.updateField(id, 'popularity', popularity);
  }
}
export { GenresRepository };
