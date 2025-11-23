import { FindOptionsWhere, Repository } from 'typeorm';
import { AlbumsEntity } from '@entities';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';

interface IAlbumRepository {
  findBySlug(slug: string): Promise<AlbumsEntity | null>;
  findByArtistId(artistId: string, limit?: number): Promise<AlbumsEntity[]>;
  findByTitle(title: string): Promise<AlbumsEntity | null>;
  // searchAlbums(
  //   options: IAlbumSearchOptions,
  // ): Promise<IPaginatedResult<AlbumsEntity>>;
  getTopAlbums(limit: number): Promise<AlbumsEntity[]>;
  getNewReleases(limit: number): Promise<AlbumsEntity[]>;
  getAlbumsByGenre(genre: string, limit: number): Promise<AlbumsEntity[]>;
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

  async findByTitle(title: string): Promise<AlbumsEntity | null> {
    return await this.findOne({
      title,
    } as any as FindOptionsWhere<AlbumsEntity>);
  }
  async findBySlug(slug: string): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({
      where: {
        slug,
        is_deleted: false,
      } as any as FindOptionsWhere<AlbumsEntity>,
      relations: ['artist'],
    });
  }

  async findByArtistId(
    artistId: string,
    limit: number = 10,
  ): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        artist_id: artistId,
        is_deleted: false,
      } as any as FindOptionsWhere<AlbumsEntity>,
      order: { release_date: 'DESC' },
      take: limit,
    });
  }

  async getTopAlbums(limit: number = 10): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        status: 'public',
      } as any as FindOptionsWhere<AlbumsEntity>,
      relations: ['artist'],
      order: { popularity: 'DESC', total_plays: 'DESC' },
      take: limit,
    });
  }

  async getNewReleases(limit: number = 10): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        status: 'public',
      } as any as FindOptionsWhere<AlbumsEntity>,
      relations: ['artist'],
      order: { release_date: 'DESC' },
      take: limit,
    });
  }

  async getAlbumsByGenre(
    genre: string,
    limit: number = 10,
  ): Promise<AlbumsEntity[]> {
    return await this.repository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('album.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('album.status = :status', { status: 'public' })
      .andWhere(':genre = ANY(album.genres)', { genre })
      .orderBy('album.popularity', 'DESC')
      .take(limit)
      .getMany();
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
