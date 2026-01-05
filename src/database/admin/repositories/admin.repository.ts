import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base';
import { Admin } from '@AdminEntities';

class AdminRepository extends BaseRepository<Admin> {
  constructor(
    @InjectRepository(Admin)
    repository: Repository<Admin>,
  ) {
    super(repository);
  }
}
export { AdminRepository };
