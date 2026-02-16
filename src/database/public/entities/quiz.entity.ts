import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { SubjectQuizAssignmentsEntity } from './subject_quiz_assignments.entity';

@Entity('quiz')
@Index('idx_quiz_id', ['id'])
export class QuizEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => SubjectQuizAssignmentsEntity, (sq) => sq.quiz)
  subjectQuizzes: SubjectQuizAssignmentsEntity[];

  @Column({ nullable: false, unique: true })
  question: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    default: () => 'ARRAY[]::text[]',
  })
  answers: string[];
}
