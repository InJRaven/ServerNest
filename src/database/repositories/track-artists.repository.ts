import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackArtistsEntity } from '@entities';

@Injectable()
class TrackArtistsRepository {
  constructor(
    @InjectRepository(TrackArtistsEntity)
    private readonly repository: Repository<TrackArtistsEntity>,
  ) {}

  async createSongArtist(
    data: Partial<TrackArtistsEntity>,
  ): Promise<TrackArtistsEntity> {
    try {
      const songArtist = this.repository.create(data);
      return await this.repository.save(songArtist);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Song-Artist relationship already exists`);
      }
      if (error.code === '23503') {
        throw new BadRequestException('Song or Artist not found');
      }
      throw error;
    }
  }

  async findByTrackId(trackId: string): Promise<TrackArtistsEntity[]> {
    return await this.repository.find({
      where: { track_id: trackId },
      relations: ['artist'],
      order: { role: 'ASC' },
    });
  }

  async findByArtistId(artistId: string): Promise<TrackArtistsEntity[]> {
    return await this.repository.find({
      where: { artist_id: artistId },
      relations: ['song', 'song.album'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRole(
    trackId: string,
    role: string,
  ): Promise<TrackArtistsEntity[]> {
    return await this.repository.find({
      where: { track_id: trackId, role: role as any },
      relations: ['artist'],
    });
  }

  async deleteSongArtist(trackId: string, artistId: string): Promise<boolean> {
    const result = await this.repository.delete({
      track_id: trackId,
      artist_id: artistId,
    });
    return (result.affected ?? 0) > 0;
  }

  async deleteAllBySongId(songId: string): Promise<void> {
    await this.repository.delete({ track_id: songId });
  }

  async updateRole(
    songId: string,
    artistId: string,
    role: string,
  ): Promise<TrackArtistsEntity | null> {
    await this.repository.update(
      { track_id: songId, artist_id: artistId },
      { role: role as any },
    );
    return await this.repository.findOne({
      where: { track_id: songId, artist_id: artistId },
    });
  }
}

export { TrackArtistsRepository };
