import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackArtistsEntity } from '@entities';
interface ITrackArtistRepository {
  exists(trackId: string, artistId: string): Promise<boolean>;
  addArtistToTrack(
    trackId: string,
    artistId: string,
    role?: 'main' | 'featured' | 'composer' | 'producer',
  ): Promise<TrackArtistsEntity>;
  removeArtistFromTrack(trackId: string, artistId: string): Promise<boolean>;
  findByTrackId(trackId: string): Promise<TrackArtistsEntity[]>;
  findByArtistId(artistId: string): Promise<TrackArtistsEntity[]>;
  updateRole(
    trackId: string,
    artistId: string,
    role: 'main' | 'featured' | 'composer' | 'producer',
  ): Promise<boolean>;
}
@Injectable()
class TrackArtistsRepository implements ITrackArtistRepository {
  constructor(
    @InjectRepository(TrackArtistsEntity)
    private readonly repository: Repository<TrackArtistsEntity>,
  ) {}

  async exists(trackId: string, artistId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        track_id: trackId,
        artist_id: artistId,
      },
    });
    return count > 0;
  }

  async addArtistToTrack(
    trackId: string,
    artistId: string,
    role: 'main' | 'featured' | 'composer' | 'producer' = 'main',
  ): Promise<TrackArtistsEntity> {
    const exists = await this.exists(trackId, artistId);
    if (exists) {
      throw new Error('Artist already added to this track');
    }

    const trackArtist = this.repository.create({
      track_id: trackId,
      artist_id: artistId,
      role,
    });

    return await this.repository.save(trackArtist);
  }

  async removeArtistFromTrack(
    trackId: string,
    artistId: string,
  ): Promise<boolean> {
    const result = await this.repository.delete({
      track_id: trackId,
      artist_id: artistId,
    });
    return (result.affected || 0) > 0;
  }

  async findByTrackId(trackId: string): Promise<TrackArtistsEntity[]> {
    return await this.repository.find({
      where: { track_id: trackId },
      relations: ['artist'],
      order: {
        role: 'ASC',
      },
    });
  }

  async findByArtistId(artistId: string): Promise<TrackArtistsEntity[]> {
    return await this.repository.find({
      where: { artist_id: artistId },
      relations: ['track', 'track.album'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateRole(
    trackId: string,
    artistId: string,
    role: 'main' | 'featured' | 'composer' | 'producer',
  ): Promise<boolean> {
    const result = await this.repository.update(
      {
        track_id: trackId,
        artist_id: artistId,
      },
      { role },
    );
    return (result.affected || 0) > 0;
  }
}

export { TrackArtistsRepository };
