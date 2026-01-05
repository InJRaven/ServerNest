import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { Album, Track } from '@CoreEntities';
import { ArtistRoleAssignment } from './relations/artist_role_assignment.entity';

@Entity('artists')
@Index('idx_artist_id', ['id'])
@Index('idx_artist_slug', ['slug'], { unique: true })
@Index('idx_artist_popularity', ['popularity'])
@Index('idx_artist_isDeleted', ['isDeleted'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ length: 512, nullable: true })
  profilePictureUrl?: string;

  @Column({ length: 512, nullable: true })
  bannerUrl?: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'bigint', default: 0 })
  monthlyListeners: string; // using string for safety with very big numbers

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  popularity: number;

  @Column({ type: 'json', nullable: true })
  external_urls: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'date' })
  debut_date: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  // ── Relationships ───────────────────────────────────────────────────
  @ManyToMany(() => Track, (track) => track.artists)
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.mainArtist)
  albums: Album[];

  @OneToMany(() => ArtistRoleAssignment, (assignment) => assignment.role)
  assignments: ArtistRoleAssignment[];
  //   @ManyToMany(() => User, (user) => user.followedArtists)
  //   followers: User[];
}
