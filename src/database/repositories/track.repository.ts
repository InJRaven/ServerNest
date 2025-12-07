import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { TracksEntity } from '@entities';
import { BaseRepository } from '@base';

interface ITrackRepository {
  findBySlug(slug: string): Promise<TracksEntity | null>;
  findByTitle(title: string): Promise<TracksEntity | null>;

  findByAlbumId(
    options?: FindManyOptions<TracksEntity>,
  ): Promise<TracksEntity[]>;
  // searchTracks(
  //   options: ITrackSearchOptions,
  // ): Promise<IPaginatedResult<TracksEntity>>;
  getTopTracks(limit: number): Promise<TracksEntity[]>;
  getTracksByArtist(artistId: string, limit: number): Promise<TracksEntity[]>;
  getTracksByGenre(genreId: string, limit: number): Promise<TracksEntity[]>;
  getTrendingTracks(limit: number): Promise<TracksEntity[]>;
  incrementPlays(id: string, count: number): Promise<void>;
  incrementLikes(id: string, count: number): Promise<void>;
  updatePopularity(id: string, popularity: number): Promise<void>;
}

@Injectable()
class TrackRepository
  extends BaseRepository<TracksEntity>
  implements ITrackRepository
{
  constructor(repository: Repository<TracksEntity>) {
    super(repository);
  }

  async findByTitle(title: string): Promise<TracksEntity | null> {
    return await this.findOne({
      where: { title },
    });
  }
  async findBySlug(slug: string): Promise<TracksEntity | null> {
    return await this.repository.findOne({
      where: {
        slug,
        is_deleted: false,
      },
      relations: ['album', 'album.artist', 'track_artists', 'track_genres'],
    });
  }

  async findByAlbumId(
    options?: FindManyOptions<TracksEntity>,
  ): Promise<TracksEntity[]> {
    return await this.repository.find({
      ...options,
      where: {
        ...(options?.where ?? {}),
      },
      order: { track_no: 'ASC' },
    });
  }

  async getTopTracks(limit: number = 10): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        status: 'public',
      },
      relations: ['album', 'album.artist'],
      order: { popularity: 'DESC', play_count: 'DESC' },
      take: limit,
    });
  }

  async getTracksByArtist(
    artistId: string,
    limit: number = 10,
  ): Promise<TracksEntity[]> {
    return await this.repository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.artist', 'artist')
      .leftJoin('track.track_artists', 'track_artist')
      .where('track.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('track.status = :status', { status: 'public' })
      .andWhere(
        '(album.artist_id = :artistId OR track_artist.artist_id = :artistId)',
        { artistId },
      )
      .orderBy('track.popularity', 'DESC')
      .take(limit)
      .getMany();
  }

  async getTracksByGenre(
    genreId: string,
    limit: number = 10,
  ): Promise<TracksEntity[]> {
    return await this.repository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.artist', 'artist')
      .leftJoin('track.track_genres', 'track_genre')
      .where('track.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('track.status = :status', { status: 'public' })
      .andWhere('track_genre.genre_id = :genreId', { genreId })
      .orderBy('track.popularity', 'DESC')
      .take(limit)
      .getMany();
  }

  async getTrendingTracks(limit: number = 10): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        status: 'public',
      } as any as FindOptionsWhere<TracksEntity>,
      relations: ['album', 'album.artist'],
      order: { play_count: 'DESC', popularity: 'DESC' },
      take: limit,
    });
  }

  async incrementPlays(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'play_count', count);
  }

  async incrementLikes(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'like_count', count);
  }

  async updatePopularity(id: string, popularity: number): Promise<void> {
    await this.updateField(id, 'popularity', popularity);
  }
}
export { TrackRepository };
