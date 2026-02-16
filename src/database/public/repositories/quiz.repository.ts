import { BaseRepository } from '@base';
import { QuizEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class QuizRepository extends BaseRepository<QuizEntity> {
  constructor(
    @InjectRepository(QuizEntity)
    repository: Repository<QuizEntity>,
  ) {
    super(repository);
  }
}
