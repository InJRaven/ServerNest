import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { ArtistRoleAssignment } from './relations/artist_role_assignment.entity';

@Entity('artist_roles')
@Index('idx_artist_roles_id', ['id'])
@Index('idx_artist_roles_name', ['name'], { unique: true })
@Index('idx_artist_roles_isDeleted', ['isDeleted'])
export class ArtistRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  // Optional: display order / priority
  @Column({ type: 'smallint', default: 100 })
  displayOrder: number;

  @OneToMany(() => ArtistRoleAssignment, (assignment) => assignment.role)
  assignments: ArtistRoleAssignment[];
}
