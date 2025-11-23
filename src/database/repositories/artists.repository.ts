import { FindOptionsWhere, Repository } from 'typeorm';
import { ArtistsEntity } from '@entities';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';

interface IArtistRepository {
  findBySlug(slug: string): Promise<ArtistsEntity | null>;
  findByTitle(title: string): Promise<ArtistsEntity | null>;
  // searchArtists(
  //   options: IArtistSearchOptions,
  // ): Promise<IPaginatedResult<ArtistsEntity>>;
  getTopArtists(limit: number): Promise<ArtistsEntity[]>;
  getTrendingArtists(limit: number): Promise<ArtistsEntity[]>;
  getArtistsByGenre(genre: string, limit: number): Promise<ArtistsEntity[]>;
  incrementMonthlyListeners(id: string, count: number): Promise<void>;
  incrementFollowers(id: string, count: number): Promise<void>;
  updatePopularity(id: string, popularity: number): Promise<void>;
}
@Injectable()
class ArtistsRepository
  extends BaseRepository<ArtistsEntity>
  implements IArtistRepository
{
  constructor(repository: Repository<ArtistsEntity>) {
    super(repository);
  }
  async findBySlug(slug: string): Promise<ArtistsEntity | null> {
    return await this.findOne({
      slug,
    } as any as FindOptionsWhere<ArtistsEntity>);
  }

  async findByTitle(title: string): Promise<ArtistsEntity | null> {
    return await this.findOne({
      title,
    } as any as FindOptionsWhere<ArtistsEntity>);
  }

  async getTopArtists(limit: number = 10): Promise<ArtistsEntity[]> {
    return await this.repository.find({
      where: {
        is_deleted: false,
        status: 'active',
      } as any as FindOptionsWhere<ArtistsEntity>,
      order: { popularity: 'DESC', monthly_listeners: 'DESC' },
      take: limit,
    });
  }

  async getTrendingArtists(limit: number = 10): Promise<ArtistsEntity[]> {
    return await this.repository.find({
      where: { is_deleted: false, status: 'active' },
      order: {
        monthly_listeners: 'DESC', // ← Hot right now!
        followers: 'DESC',
        popularity: 'DESC',
      },
      take: limit,
    });
  }

  async getArtistsByGenre(
    genre: string,
    limit: number = 10,
  ): Promise<ArtistsEntity[]> {
    return await this.repository
      .createQueryBuilder('artist')
      .where('artist.is_deleted = :isDeleted', { isDeleted: false })
      .andWhere('artist.status = :status', { status: 'active' })
      .andWhere(':genre = ANY(artist.genres)', { genre })
      .orderBy('artist.popularity', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Increment monthly listeners
   */
  async incrementMonthlyListeners(
    id: string,
    count: number = 1,
  ): Promise<void> {
    await this.increment(id, 'monthly_listeners', count);
  }

  /**
   * Increment followers
   */
  async incrementFollowers(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'followers', count);
  }

  /**
   * Update popularity
   */
  async updatePopularity(id: string, popularity: number): Promise<void> {
    await this.updateField(id, 'popularity', popularity);
  }
}
export { ArtistsRepository };
