import { BaseRepository } from '@base';
import { ArtistRole } from '@CoreEntities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class ArtistRolesRepository extends BaseRepository<ArtistRole> {
  constructor(
    @InjectRepository(ArtistRole)
    repository: Repository<ArtistRole>,
  ) {
    super(repository);
  }
}
export { ArtistRolesRepository };
