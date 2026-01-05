import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '@base';
import { AdminRoleAssignment } from './admin_role_assignments';

@Entity('admins')
@Index('idx_admin_username', ['username'], { unique: true })
@Index('idx_admin_email', ['email'], { unique: true })
@Index('idx_admin_isDeleted', ['isDeleted'])
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 100 })
  firstName?: string;

  @Column({ nullable: true, length: 100 })
  lastName?: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'en', nullable: true })
  language: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => AdminRoleAssignment, (assignment) => assignment.admin)
  roleAssignments: AdminRoleAssignment[];
}
