import { SubjectRepository } from './subject.repository';
import { QuizRepository } from './quiz.repository';
import { SubjectQuizAssignmentsRepository } from './subject_quiz_assignments.repository';

export { SubjectRepository, QuizRepository, SubjectQuizAssignmentsRepository };

export const PublicRepositories = [
  SubjectRepository,
  QuizRepository,
  SubjectQuizAssignmentsRepository,
];
