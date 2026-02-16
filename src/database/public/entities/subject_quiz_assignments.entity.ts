import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { SubjectEntity } from './subject.entity';
import { QuizEntity } from './quiz.entity';

@Entity('subject_quiz_assignments')
export class SubjectQuizAssignmentsEntity {
  @PrimaryColumn('uuid')
  subjectId: string;

  @PrimaryColumn('uuid')
  quizId: string;

  @ManyToOne(() => SubjectEntity, (subject) => subject.subjectQuizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subjectId' })
  subject: SubjectEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.subjectQuizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;
}
