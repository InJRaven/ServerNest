import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SongEntity } from '@/model/entity';

@Injectable()
class SongRepository {
  constructor(
    @InjectRepository(SongEntity)
    private readonly repository: Repository<SongEntity>,
  ) {}

  async createSong(data: Partial<SongEntity>): Promise<SongEntity> {
    try {
      const song = this.repository.create({ id: uuidv4(), ...data });
      return await this.repository.save(song);
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Song already exists`);
      }
      // Foreign key constraint - album_id không tồn tại
      if (error.code === '23503') {
        throw new BadRequestException('Album not found');
      }
      throw error;
    }
  }

  async updateSong(
    id: string,
    data: Partial<SongEntity>,
  ): Promise<SongEntity | null> {
    try {
      const result = await this.repository.update(id, data);

      if (result.affected === 0) {
        return null;
      }

      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Song already exists`);
      }
      if (error.code === '23503') {
        throw new BadRequestException('Album not found');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<SongEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<SongEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'album',
        'album.artist',
        'song_artists',
        'song_artists.artist',
        'song_genres',
        'song_genres.genre',
      ],
    });
  }

  async findByAlbumId(albumId: string): Promise<SongEntity[]> {
    return await this.repository.find({
      where: { album_id: albumId },
      order: { track_no: 'ASC' },
    });
  }

  async findByAlbumIdWithArtists(albumId: string): Promise<SongEntity[]> {
    return await this.repository.find({
      where: { album_id: albumId },
      relations: ['song_artists', 'song_artists.artist'],
      order: { track_no: 'ASC' },
    });
  }

  async findAll(): Promise<SongEntity[]> {
    return await this.repository.find({
      relations: ['album', 'album.artist'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteSong(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByAlbumId(albumId: string): Promise<number> {
    return await this.repository.count({
      where: { album_id: albumId },
    });
  }

  async searchByTitle(searchTerm: string): Promise<SongEntity[]> {
    return await this.repository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.album', 'album')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('song.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('song.createdAt', 'DESC')
      .getMany();
  }

  async findByDuration(
    minDuration: string,
    maxDuration: string,
  ): Promise<SongEntity[]> {
    return await this.repository
      .createQueryBuilder('song')
      .where('song.duration BETWEEN :minDuration AND :maxDuration', {
        minDuration,
        maxDuration,
      })
      .orderBy('song.duration', 'ASC')
      .getMany();
  }

  async findExplicit(): Promise<SongEntity[]> {
    return await this.repository.find({
      where: { is_explicit: true },
      relations: ['album', 'album.artist'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateTrackNumbers(
    albumId: string,
    trackUpdates: { id: string; track_no: number }[],
  ): Promise<void> {
    // Bulk update track numbers
    for (const update of trackUpdates) {
      await this.repository.update(
        { id: update.id, album_id: albumId },
        { track_no: update.track_no },
      );
    }
  }
}
export { SongRepository };
