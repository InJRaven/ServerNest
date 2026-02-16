import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { SubjectQuizAssignmentsEntity } from './subject_quiz_assignments.entity';

@Entity('subject')
@Index('idx_quiz_identify', ['identify'], { unique: true })
@Index('idx_quiz_shortName', ['shortName'])
export class SubjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  identify: string;

  @Column({ nullable: false, unique: true })
  shortName: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    default: () => 'ARRAY[]::text[]',
  })
  urlSubject: string[];

  @OneToMany(() => SubjectQuizAssignmentsEntity, (sq) => sq.subject)
  subjectQuizzes: SubjectQuizAssignmentsEntity[];
}
