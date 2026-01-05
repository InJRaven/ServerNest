import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { ArtistsEntity } from './artists.entity';
import { ArRoleEntity } from './arRole.entity';

@Entity({ name: 'ArtistRoles' })
@Index(['identifier'], { unique: true })
class ArtistRolesEntity {
  @PrimaryColumn('uuid')
  artistId: string;

  @PrimaryColumn('uuid')
  roleId: string;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.artist_roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistsEntity;

  @ManyToOne(() => ArRoleEntity, (role) => role.artist_roles, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: ArRoleEntity;

  @CreateDateColumn()
  createdAt: Date;
}

export { ArtistRolesEntity };
