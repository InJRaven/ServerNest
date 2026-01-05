import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@base';
import { AdminRoleAssignment } from '@AdminEntities';

class AdminRoleAssignmentRepository extends BaseRepository<AdminRoleAssignment> {
  constructor(
    @InjectRepository(AdminRoleAssignment)
    repository: Repository<AdminRoleAssignment>,
  ) {
    super(repository);
  }
}
export { AdminRoleAssignmentRepository };
