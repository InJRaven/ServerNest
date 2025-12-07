import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenresEntity } from '@entities';
import { BaseRepository } from '@base';
interface IGenreRepository {
  // searchGenres(
  //   options: IGenreSearchOptions,
  // ): Promise<IPaginatedResult<GenresEntity>>;
  incrementTrackCount(id: string, count: number): Promise<void>;
  incrementAlbumCount(id: string, count: number): Promise<void>;
  updatePopularity(id: string, popularity: number): Promise<void>;
}

class GenresRepository
  extends BaseRepository<GenresEntity>
  implements IGenreRepository
{
  constructor(
    @InjectRepository(GenresEntity)
    repository: Repository<GenresEntity>,
  ) {
    super(repository);
  }

  async incrementTrackCount(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'track_count', count);
  }

  async incrementAlbumCount(id: string, count: number = 1): Promise<void> {
    await this.increment(id, 'album_count', count);
  }

  async updatePopularity(id: string, popularity: number): Promise<void> {
    await this.updateField(id, 'popularity', popularity);
  }
}
export { GenresRepository };
