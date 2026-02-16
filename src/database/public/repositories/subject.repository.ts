import { BaseRepository } from '@base';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { SubjectEntity } from '../entities';

export class SubjectRepository extends BaseRepository<SubjectEntity> {
  constructor(
    @InjectRepository(SubjectEntity)
    repository: Repository<SubjectEntity>,
  ) {
    super(repository);
  }
}
