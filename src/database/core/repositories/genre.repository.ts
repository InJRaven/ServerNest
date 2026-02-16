import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseRepository } from '@base';
import { Genre } from '@CoreEntities';
class GenreRepository extends BaseRepository<Genre> {
  constructor(
    @InjectRepository(Genre)
    repository: Repository<Genre>,
  ) {
    super(repository);
  }

  async findAll(options?: FindManyOptions<Genre>): Promise<any[]> {
    const qb = this.repository
      .createQueryBuilder('genres')
      .leftJoin('genres.trackGenres', 'tg')
      .leftJoin('tg.track', 'track')
      .leftJoin('genres.albumGenres', 'ag')
      // .select([
      //   'genres.id AS id',
      //   'genres.name AS name',
      //   'genres.slug AS slug',
      //   'genres.description AS description',
      //   'genres.coverUrl AS coverUrl',
      //   'genres.isDeleted AS deleted',
      //   'genres.createdAt AS created_at',
      //   'COUNT(DISTINCT tg.trackId) AS trackCount',
      //   'COUNT(DISTINCT ag.albumId) AS albumCount',
      //   'COALESCE(SUM(track.playCount), 0) AS totalPlays',
      // ])
      .addSelect('COUNT(DISTINCT tg.trackId)', 'trackCount')
      .addSelect('COUNT(DISTINCT ag.albumId)', 'albumCount')
      .addSelect('COALESCE(SUM(track.playCount), 0)', 'totalPlays')
      .groupBy('genres.id')
      .orderBy('genres.name', 'ASC');
    // .getRawMany();
    if (options?.where) {
      qb.where(options.where);
    }

    const results = await qb.getRawMany();
    return results.map((g) => ({
      id: g.genres_id,
      identify: g.genres_identify,
      name: g.genres_name,
      slug: g.genres_slug,
      description: g.genres_description,
      coverUrl: g.genres_coverUrl,
      trackCount: Number(g.trackCount || 0),
      albumCount: Number(g.albumCount || 0),
      popularity: Number(g.totalPlays || 0),
      isDeleted: g.genres_isDeleted,
      createdAt: g.genres_createdAt,
    }));
  }
}
export { GenreRepository };
