import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsEntity } from '@entities';

@Injectable()
class ArtistsRepository {
  constructor(
    @InjectRepository(ArtistsEntity)
    private readonly repository: Repository<ArtistsEntity>,
  ) {}

  /**
   * Create/Update/Delete New Artist
   */
  async createArtist(data: Partial<ArtistsEntity>): Promise<ArtistsEntity> {
    const artist = this.repository.create({ id: uuidv4(), ...data });
    return await this.repository.save(artist);
  }

  async updateArtist(
    id: string,
    data: Partial<ArtistsEntity>,
  ): Promise<ArtistsEntity | null> {
    const result = await this.repository.update(id, data);
    if (result.affected === 0) {
      return null;
    }
    return await this.repository.findOne({ where: { id } });
  }

  async softDeleteArtist(id: string): Promise<void> {
    await this.repository.update(id, {
      is_deleted: true,
    });
  }

  async hardDeleteArtist(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find Artist
   */
  async findArtistById(
    id: string,
    includeRelations: boolean = true,
  ): Promise<ArtistsEntity | null> {
    return await this.repository.findOne({
      where: { id, is_deleted: false },
      relations: includeRelations ? ['albums', 'song_artists'] : [],
    });
  }

  async findArtistByIdIncludingDeleted(
    id: string,
    includeRelations: boolean = false,
  ): Promise<ArtistsEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: includeRelations ? ['albums', 'song_artists'] : [],
    });
  }

  async findByIdIncludingDeleted(
    id: string,
    includeRelations: boolean = false,
  ): Promise<ArtistsEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: includeRelations ? ['albums', 'song_artists'] : [],
    });
  }

  async findBySlug(
    slug: string,
    includeRelations: boolean = true,
  ): Promise<ArtistsEntity | null> {
    return await this.repository.findOne({
      where: { slug, is_deleted: false },
      relations: includeRelations ? ['albums', 'song_artists'] : [],
    });
  }

  async findArtistByTitle(title: string): Promise<ArtistsEntity | null> {
    return await this.repository.findOne({
      where: { title, is_deleted: false },
    });
  }

  async findAllArtists(): Promise<ArtistsEntity[]> {
    return await this.repository.find();
  }

  async searchByTitle(searchTerm: string): Promise<ArtistsEntity[]> {
    return await this.repository
      .createQueryBuilder('artist')
      .where('artist.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('artist.title', 'ASC')
      .getMany();
  }

  /**
   * Get Artists
   */
  async getTopArtists(limit: number = 10): Promise<ArtistsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false, verified: true },
      order: { popularity: 'DESC' },
      take: limit,
    });
  }

  async getTrendingArtists(limit: number = 10): Promise<ArtistsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { monthly_listeners: 'DESC' },
      take: limit,
    });
  }

  async getNewArtists(limit: number = 10): Promise<ArtistsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Restore Artist
   */
  async restoreArtist(id: string): Promise<void> {
    await this.repository.update(id, {
      is_deleted: false,
    });
  }

  /**
   * Check if title exists
   */
  async isTitleExists(title: string, excludeId?: string): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('artist')
      .where('artist.title = :title AND artist.is_deleted = false', { title });

    if (excludeId) {
      queryBuilder.andWhere('artist.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }
}
export { ArtistsRepository };
