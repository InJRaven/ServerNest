import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base';
import { ArRoleEntity } from '@entities';

class ArRoleRepository extends BaseRepository<ArRoleEntity> {
  constructor(
    @InjectRepository(ArRoleEntity)
    repository: Repository<ArRoleEntity>,
  ) {
    super(repository);
  }
}
export { ArRoleRepository };
