import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TracksEntity } from '@entities';

@Injectable()
class TrackRepository {
  constructor(
    @InjectRepository(TracksEntity)
    private readonly repository: Repository<TracksEntity>,
  ) {}

  /**
   * Create/Update/Delete Track
   */
  async createTrack(data: Partial<TracksEntity>): Promise<TracksEntity> {
    const track = this.repository.create({ id: uuidv4(), ...data });
    return await this.repository.save(track);
  }

  async updateTrack(
    id: string,
    data: Partial<TracksEntity>,
  ): Promise<TracksEntity | null> {
    const result = await this.repository.update(id, data);

    if (result.affected === 0) {
      return null;
    }

    return await this.repository.findOne({ where: { id } });
  }

  async softDeleteTrack(id: string): Promise<void> {
    await this.repository.update(id, { is_deleted: true });
  }

  async hardDeleteTrack(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find Tracks
   */
  async findTrackById(
    id: string,
    includeRelations: boolean = true,
  ): Promise<TracksEntity | null> {
    return await this.repository.findOne({
      where: { id, is_deleted: false },
      relations: includeRelations
        ? ['album', 'track_artists', 'track_genres']
        : [],
    });
  }

  async findTrackByIdIncludingDeleted(
    id: string,
    includeRelations: boolean = true,
  ): Promise<TracksEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: includeRelations
        ? ['album', 'track_artists', 'track_genres']
        : [],
    });
  }

  async findTrackByTitle(title: string): Promise<TracksEntity | null> {
    return await this.repository.findOne({
      where: { title, is_deleted: false },
    });
  }

  async findTrackByAlbumId(albumId: string): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { album_id: albumId, is_deleted: false },
      order: { track_no: 'ASC' },
    });
  }

  async findByAlbumIdWithArtists(albumId: string): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { album_id: albumId },
      order: { track_no: 'ASC' },
    });
  }

  async findAllTracks(): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllTracksIncludingDeleted(): Promise<TracksEntity[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get Tracks
   */
  async getPopularTracks(limit: number = 10): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async getTrendingTracks(limit: number = 10): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { play_count: 'DESC' },
      take: limit,
    });
  }

  async getNewReleases(limit: number = 10): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { release_date: 'DESC' },
      take: limit,
    });
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async searchTracks(
    query: string,
    limit: number = 10,
  ): Promise<TracksEntity[]> {
    return await this.repository.find({
      where: {
        title: ILike(`%${query}%`),
        is_deleted: false,
      },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async findByDuration(
    minDuration: string,
    maxDuration: string,
  ): Promise<TracksEntity[]> {
    return await this.repository
      .createQueryBuilder('tracks')
      .where('tracks.duration BETWEEN :minDuration AND :maxDuration', {
        minDuration,
        maxDuration,
      })
      .orderBy('tracks.duration', 'ASC')
      .getMany();
  }
}
export { TrackRepository };
