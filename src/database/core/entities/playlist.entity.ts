import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { Track, User } from '@CoreEntities';

@Entity('playlists')
@Index('idx_playlist_id', ['id'])
@Index('idx_playlist_creator', ['creator'])
@Index('idx_playlist_is_public', ['isPublic'])
@Index('idx_playlist_isDeleted', ['isDeleted'])
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 512, nullable: true })
  coverUrl?: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isCollaborative: boolean;

  @Column({ default: 0 })
  followerCount: number;

  @ManyToOne(() => User, (user) => user.playlists)
  creator: User;

  @ManyToMany(() => Track, (track) => track.playlists)
  @JoinTable({ name: 'playlist_tracks' })
  tracks: Track[];
}
