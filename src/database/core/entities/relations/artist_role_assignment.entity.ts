import { Artist, Track } from '@CoreEntities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ArtistRole } from '../artist_role.entity';
import { Admin } from '@AdminEntities';

@Entity('artist_role_assignments')
@Index('idx_artist_role_assignments_artist_track', ['artistId', 'trackId'])
@Index('idx_artist_role_assignments_role', ['roleId'])
@Index('idx_artist_role_assignments_isPrimary', ['isPrimary'])
export class ArtistRoleAssignment {
  @PrimaryColumn('uuid')
  artistId: string;

  @PrimaryColumn('uuid')
  roleId: string;

  @PrimaryColumn('uuid')
  trackId: string;

  @ManyToOne(() => Artist, (a) => a.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Track, (t) => t.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trackId' })
  track: Track; // ← the song/track this role applies to

  @ManyToOne(() => ArtistRole, (role) => role.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: ArtistRole;

  // Optional: who added/verified this role assignment
  @ManyToOne(() => Admin, { nullable: true })
  assignedBy?: Admin;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  assignedAt: Date;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date;
}
