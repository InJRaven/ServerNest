import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Admin, AdminRole } from '@AdminEntities';
import { BaseEntity } from '@base';

@Entity('admin_role_assignments')
@Index('idx_assignment_admin_active', ['admin', 'isActive']) // fast active role lookup per admin
@Index('idx_assignment_role', ['role'])
@Index('idx_assignment_assigned_at', ['assignedAt'])
export class AdminRoleAssignment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Admin, (admin) => admin.roleAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => AdminRole, (role) => role.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: AdminRole;

  // Who assigned this role (important for audit)
  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'assigned_by_id' })
  assignedBy?: Admin;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  assignedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // Optional: when the role was revoked
  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date;
}
