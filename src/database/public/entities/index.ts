import { SubjectEntity } from './subject.entity';
import { QuizEntity } from './quiz.entity';
import { SubjectQuizAssignmentsEntity } from './subject_quiz_assignments.entity';

export { SubjectEntity, QuizEntity, SubjectQuizAssignmentsEntity };

export const PublicEntities = [
  SubjectEntity,
  QuizEntity,
  SubjectQuizAssignmentsEntity,
];
