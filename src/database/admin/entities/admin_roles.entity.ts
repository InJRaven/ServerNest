import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminRoleAssignment } from './admin_role_assignments';
import { BaseEntity } from '@base';

@Entity('admin_roles')
@Index('idx_admin_role_identify', ['identify'], { unique: true })
@Index('idx_admin_role_name', ['name'], { unique: true })
export class AdminRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  identify: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  displayOrder?: number;

  @Column({ default: false, nullable: true })
  isSuperAdmin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date;
  @OneToMany(() => AdminRoleAssignment, (assignment) => assignment.role)
  assignments: AdminRoleAssignment[];
}
