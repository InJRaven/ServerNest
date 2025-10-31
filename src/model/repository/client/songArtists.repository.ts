import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongArtistsEntity } from '@/model/entity';

@Injectable()
class SongArtistsRepository {
  constructor(
    @InjectRepository(SongArtistsEntity)
    private readonly repository: Repository<SongArtistsEntity>,
  ) {}

  async createSongArtist(
    data: Partial<SongArtistsEntity>,
  ): Promise<SongArtistsEntity> {
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

  async findBySongId(songId: string): Promise<SongArtistsEntity[]> {
    return await this.repository.find({
      where: { song_id: songId },
      relations: ['artist'],
      order: { role: 'ASC' },
    });
  }

  async findByArtistId(artistId: string): Promise<SongArtistsEntity[]> {
    return await this.repository.find({
      where: { artist_id: artistId },
      relations: ['song', 'song.album'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRole(songId: string, role: string): Promise<SongArtistsEntity[]> {
    return await this.repository.find({
      where: { song_id: songId, role: role as any },
      relations: ['artist'],
    });
  }

  async deleteSongArtist(songId: string, artistId: string): Promise<boolean> {
    const result = await this.repository.delete({
      song_id: songId,
      artist_id: artistId,
    });
    return (result.affected ?? 0) > 0;
  }

  async deleteAllBySongId(songId: string): Promise<void> {
    await this.repository.delete({ song_id: songId });
  }

  async updateRole(
    songId: string,
    artistId: string,
    role: string,
  ): Promise<SongArtistsEntity | null> {
    await this.repository.update(
      { song_id: songId, artist_id: artistId },
      { role: role as any },
    );
    return await this.repository.findOne({
      where: { song_id: songId, artist_id: artistId },
    });
  }
}

export { SongArtistsRepository };
