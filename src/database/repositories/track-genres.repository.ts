import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackGenresEntity } from '@entities';

@Injectable()
class TrackGenresRepository {
  constructor(
    @InjectRepository(TrackGenresEntity)
    private readonly repository: Repository<TrackGenresEntity>,
  ) {}

  async createSongGenre(
    data: Partial<TrackGenresEntity>,
  ): Promise<TrackGenresEntity> {
    try {
      const songGenre = this.repository.create(data);
      return await this.repository.save(songGenre);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Song-Genre relationship already exists`);
      }
      if (error.code === '23503') {
        throw new BadRequestException('Song or Genre not found');
      }
      throw error;
    }
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
      relations: ['song', 'song.album', 'song.album.artist'],
    });
  }

  async deleteSongGenre(trackId: string, genreId: string): Promise<boolean> {
    const result = await this.repository.delete({
      track_id: trackId,
      genre_id: genreId,
    });
    return (result.affected ?? 0) > 0;
  }

  async deleteAllBytrackId(trackId: string): Promise<void> {
    await this.repository.delete({ track_id: trackId });
  }

  async replaceSongGenres(trackId: string, genreIds: string[]): Promise<void> {
    // Xóa tất cả genres cũ
    await this.deleteAllBytrackId(trackId);

    // Thêm genres mới
    for (const genreId of genreIds) {
      await this.createSongGenre({ track_id: trackId, genre_id: genreId });
    }
  }
}

export { TrackGenresRepository };
