import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AlbumsEntity } from '@entities';

@Injectable()
class AlbumsRepository {
  constructor(
    @InjectRepository(AlbumsEntity)
    private readonly repository: Repository<AlbumsEntity>,
  ) {}

  /**
   * Create/Update/Delete Album
   */
  async createAlbum(data: Partial<AlbumsEntity>): Promise<AlbumsEntity> {
    const album = this.repository.create({ id: uuidv4(), ...data });
    return await this.repository.save(album);
  }

  async updateAlbum(
    id: string,
    data: Partial<AlbumsEntity>,
  ): Promise<AlbumsEntity | null> {
    const result = await this.repository.update(id, data);
    if (result.affected === 0) {
      return null;
    }

    return await this.repository.findOne({ where: { id } });
  }

  async softDeleteAlbum(id: string): Promise<void> {
    await this.repository.update(id, { is_deleted: true });
  }

  async hardDeleteAlbum(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Find Albums
   */
  async findAlbumByTitle(title: string): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({
      where: { title, is_deleted: false },
    });
  }

  async findAlbumById(
    id: string,
    includeRelations: boolean = true,
  ): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({
      where: { id, is_deleted: false },
      relations: includeRelations ? ['artist', 'tracks', 'album_genres'] : [],
    });
  }

  async findAlbumByIdIncludingDeleted(
    id: string,
    includeRelations: boolean = false,
  ): Promise<AlbumsEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: includeRelations ? ['artist', 'tracks', 'album_genres'] : [],
    });
  }

  async findAlbumByArtistId(artistId: string): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        artist_id: artistId,
        is_deleted: false,
      },
      order: { release_date: 'DESC' },
    });
  }

  async findAllAlbums(): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { release_date: 'DESC' },
    });
  }

  async findAlbumWithTracks(id: string): Promise<AlbumsEntity | null> {
    return await this.repository
      .createQueryBuilder('albums')
      .leftJoinAndSelect('albums.tracks', 'tracks', 'tracks.is_deleted = false')
      .where('albums.id = :id', { id })
      .andWhere('albums.is_deleted = false')
      .orderBy('tracks.track_no', 'ASC')
      .getOne();
  }

  async findAlbumsByType(albumType: string): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        album_type: albumType,
        is_deleted: false,
      },
      order: { popularity: 'DESC' },
    });
  }

  /**
   * Get Albums
   */
  async getPopularAlbums(limit: number = 10): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async getTrendingAlbums(limit: number = 10): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { total_plays: 'DESC', updatedAt: 'DESC' },
      take: limit,
    });
  }

  async getNewReleases(limit: number = 10): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { release_date: 'DESC' },
      take: limit,
    });
  }

  /**
   * Search Album
   */
  async searchAlbums(
    query: string,
    limit: number = 10,
  ): Promise<AlbumsEntity[]> {
    return await this.repository.find({
      where: {
        title: ILike(`%${query}%`),
        is_deleted: false,
      },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  /**
   * Restore Album
   */
  async restoreAlbum(id: string): Promise<void> {
    await this.repository.update(id, { is_deleted: false });
  }
}
export { AlbumsRepository };
