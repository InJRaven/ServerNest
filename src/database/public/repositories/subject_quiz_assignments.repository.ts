import { GenericRepository } from '@base';
import { SubjectQuizAssignmentsEntity } from '../entities/subject_quiz_assignments.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
export class SubjectQuizAssignmentsRepository extends GenericRepository<SubjectQuizAssignmentsEntity> {
  constructor(
    @InjectRepository(SubjectQuizAssignmentsEntity)
    repository: Repository<SubjectQuizAssignmentsEntity>,
  ) {
    super(repository);
  }
}
