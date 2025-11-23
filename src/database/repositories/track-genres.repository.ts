import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackGenresEntity } from '@entities';

interface ITrackGenreRepository {
  exists(trackId: string, genreId: string): Promise<boolean>;
  addGenreToTrack(trackId: string, genreId: string): Promise<TrackGenresEntity>;
  removeGenreFromTrack(trackId: string, genreId: string): Promise<boolean>;
  findByTrackId(trackId: string): Promise<TrackGenresEntity[]>;
  findByGenreId(genreId: string): Promise<TrackGenresEntity[]>;
  syncTrackGenres(trackId: string, genreIds: string[]): Promise<void>;
}
@Injectable()
class TrackGenresRepository implements ITrackGenreRepository {
  constructor(
    @InjectRepository(TrackGenresEntity)
    private readonly repository: Repository<TrackGenresEntity>,
  ) {}

  async exists(trackId: string, genreId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        track_id: trackId,
        genre_id: genreId,
      },
    });
    return count > 0;
  }

  async addGenreToTrack(
    trackId: string,
    genreId: string,
  ): Promise<TrackGenresEntity> {
    const exists = await this.exists(trackId, genreId);
    if (exists) {
      throw new Error('Genre already added to this track');
    }

    const trackGenre = this.repository.create({
      track_id: trackId,
      genre_id: genreId,
    });

    return await this.repository.save(trackGenre);
  }

  async removeGenreFromTrack(
    trackId: string,
    genreId: string,
  ): Promise<boolean> {
    const result = await this.repository.delete({
      track_id: trackId,
      genre_id: genreId,
    });
    return (result.affected || 0) > 0;
  }

  async findByTrackId(trackId: string): Promise<TrackGenresEntity[]> {
    return await this.repository.find({
      where: { track_id: trackId },
      relations: ['genre'],
    });
  }

  async findByGenreId(genreId: string): Promise<TrackGenresEntity[]> {
    return await this.repository.find({
      where: { genre_id: genreId },
      relations: ['track', 'track.album', 'track.album.artist'],
    });
  }

  async syncTrackGenres(trackId: string, genreIds: string[]): Promise<void> {
    await this.repository.delete({ track_id: trackId });

    if (genreIds.length > 0) {
      const trackGenres = genreIds.map((genreId) =>
        this.repository.create({
          track_id: trackId,
          genre_id: genreId,
        }),
      );
      await this.repository.save(trackGenres);
    }
  }
}

export { TrackGenresRepository };
