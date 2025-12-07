import { FindManyOptions, Repository } from 'typeorm';
import { AlbumsEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { IPagination, BaseRepository } from '@base';

interface IAlbumRepository {
  // searchAlbums(
  //   options: IAlbumSearchOptions,
  // ): Promise<IPaginatedResult<AlbumsEntity>>;
  // getTopAlbums(limit: number): Promise<AlbumsEntity[]>;
  // getNewReleases(limit: number): Promise<AlbumsEntity[]>;
  getAlbumsByGenre(
    genre: string,
    limit: number,
    offset: number,
    options?: FindManyOptions<AlbumsEntity>,
  ): Promise<IPagination<AlbumsEntity>>;
  incrementPlays(id: string, count: number): Promise<void>;
  incrementLikes(id: string, count: number): Promise<void>;
  updatePopularity(id: string, popularity: number): Promise<void>;
  updateTotalTracks(id: string, count: number): Promise<void>;
  updateDurationTotal(id: string, duration: number): Promise<void>;
}

@Injectable()
class AlbumsRepository
  extends BaseRepository<AlbumsEntity>
  implements IAlbumRepository
{
  constructor(repository: Repository<AlbumsEntity>) {
    super(repository);
  }

  async getAlbumsByGenre(
    genre: string,
    limit: number = 10,
    offset: number = 0,
    options?: FindManyOptions<AlbumsEntity>,
  ): Promise<IPagination<AlbumsEntity>> {
    const query = this.repository
      .createQueryBuilder('albums')
      .leftJoinAndSelect('album.artist', 'artist') // PROPERTY RELATIONSHIP NAME and alias of table relationship
      .innerJoin('album.album_genres', 'albumGenre')
      .innerJoin('albumGenre.genre', 'genre')
      .where(
        'album.is_deleted = :isDeleted',
        options?.where?.['is_deleted'] ?? false,
      )
      .andWhere('album.status = :status', { status: 'public' })
      .andWhere('genre.title = :genreTitle', { genreTitle: genre })
      .orderBy('album.popularity', 'DESC');

    const total = await query.getCount();
    const data = await query.skip(offset).take(limit).getMany();

    const totalPages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 0,
      },
    };
  }

  async incrementPlays(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'total_plays', count);
  }

  async incrementLikes(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'total_likes', count);
  }

  async updatePopularity(id: string, popularity: number): Promise<void> {
    await this.updateField(id, 'popularity', popularity);
  }

  async updateTotalTracks(id: string, count: number): Promise<void> {
    await this.updateField(id, 'total_tracks', count);
  }

  async updateDurationTotal(id: string, duration: number): Promise<void> {
    await this.updateField(id, 'duration_total', duration);
  }
}
export { AlbumsRepository };
