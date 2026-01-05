import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArtistRolesEntity } from './artists-roles.entity';

enum ArtistRoleIdentifier {
  SINGER = 'singer',
  COMPOSER = 'composer',
  LYRICIST = 'lyricist',
  PRODUCER = 'producer',
  ARRANGER = 'arranger',

  INSTRUMENTALIST = 'instrumentalist',
  DJ = 'dj',
  BAND = 'band',
  ORCHESTRA = 'orchestra',
  CONDUCTOR = 'conductor',

  MIXING_ENGINEER = 'mixing engineer',
  MASTERING_ENGINEER = 'mastering engineer',
  SOUND_ENGINEER = 'sound_engineer',

  FEATURED_ARTIST = 'featured artist',
  REMIXER = 'remixer',
  VOCAL_PRODUCER = 'vocal producer',
}

@Entity({ name: 'ArRole' })
@Index(['identifier', 'title'], { unique: true })
class ArRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  identifier: string;

  @Column({ nullable: false })
  title: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ArtistRolesEntity, (artistRole) => artistRole.role)
  artist_roles: ArtistRolesEntity[];
}

export { ArRoleEntity };
