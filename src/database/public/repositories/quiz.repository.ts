import { BaseRepository } from '@base';
import { QuizEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class QuizRepository extends BaseRepository<QuizEntity> {
  protected alias: string = '';
  protected allowedColumns: string[] = [];
  protected searchableFields = [];
  constructor(
    @InjectRepository(QuizEntity)
    repository: Repository<QuizEntity>,
  ) {
    super(repository);
  }
}
