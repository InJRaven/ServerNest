import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base';
import { AdminRole } from '@AdminEntities';

class AdminRoleRepository extends BaseRepository<AdminRole> {
  constructor(
    @InjectRepository(AdminRole)
    repository: Repository<AdminRole>,
  ) {
    super(repository);
  }
}
export { AdminRoleRepository };
