import { BaseRepository } from '@base';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { SubjectEntity } from '../entities';

export class SubjectRepository extends BaseRepository<SubjectEntity> {
  protected alias: string = '';
  protected allowedColumns: string[] = [];
  protected searchableFields = [];
  constructor(
    @InjectRepository(SubjectEntity)
    repository: Repository<SubjectEntity>,
  ) {
    super(repository);
  }
}
