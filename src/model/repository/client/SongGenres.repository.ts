import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongGenresEntity } from '@/model/entity';

@Injectable()
class SongGenresRepository {
  constructor(
    @InjectRepository(SongGenresEntity)
    private readonly repository: Repository<SongGenresEntity>,
  ) {}

  async createSongGenre(
    data: Partial<SongGenresEntity>,
  ): Promise<SongGenresEntity> {
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

  async findBySongId(songId: string): Promise<SongGenresEntity[]> {
    return await this.repository.find({
      where: { song_id: songId },
      relations: ['genre'],
    });
  }

  async findByGenreId(genreId: string): Promise<SongGenresEntity[]> {
    return await this.repository.find({
      where: { genre_id: genreId },
      relations: ['song', 'song.album', 'song.album.artist'],
    });
  }

  async deleteSongGenre(songId: string, genreId: string): Promise<boolean> {
    const result = await this.repository.delete({
      song_id: songId,
      genre_id: genreId,
    });
    return (result.affected ?? 0) > 0;
  }

  async deleteAllBySongId(songId: string): Promise<void> {
    await this.repository.delete({ song_id: songId });
  }

  async replaceSongGenres(songId: string, genreIds: string[]): Promise<void> {
    // Xóa tất cả genres cũ
    await this.deleteAllBySongId(songId);

    // Thêm genres mới
    for (const genreId of genreIds) {
      await this.createSongGenre({ song_id: songId, genre_id: genreId });
    }
  }
}

export { SongGenresRepository };
