import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { Artist, Playlist, User } from '@CoreEntities';
import { AlbumTracks } from './relations/album_tracks.entity';
import { ArtistRoleAssignment } from './relations/artist_role_assignment.entity';
import { TrackGenre } from './relations/track_genres.entity';

@Entity('tracks')
@Index('idx_track_id', ['id'])
@Index('idx_track_slug', ['slug'], { unique: true })
@Index('idx_track_popularity', ['popularity'])
@Index('idx_track_playCount', ['playCount'])
@Index('idx_track_status', ['status'])
@Index('idx_track_releaseDate', ['releaseDate'])
@Index('idx_track_isDeleted', ['isDeleted'])
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, nullable: true })
  slug?: string;

  @Column()
  duration: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary?: string;

  @Column({ type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({ type: 'text', nullable: true })
  lyrics?: string;

  @Column({ length: 512 })
  audioUrl: string;

  @Column({ length: 512, nullable: true })
  coverUrl?: string;

  @Column({ default: false })
  explicit: boolean;

  @Column({ nullable: true })
  bpm: number;

  @Column({ type: 'bigint', default: 0 })
  playCount: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  popularity: number;

  @Column({ default: 'active' })
  status: 'active' | 'pending' | 'blocked';

  @Column({ type: 'json', nullable: true })
  external_urls: {
    youtube?: string;
    soundcloud?: string;
    apple_music?: string;
    tiktok?: string;
  };

  // ── Relationships ───────────────────────────────────────────────────
  @OneToMany(() => TrackGenre, (tg) => tg.track)
  trackGenres: TrackGenre[];

  @ManyToMany(() => Artist, (artist) => artist.tracks)
  @JoinTable({ name: 'artist_tracks' })
  artists: Artist[];

  @OneToMany(() => AlbumTracks, (at) => at.track)
  albumTracks: AlbumTracks[];

  @ManyToMany(() => Playlist, (playlist) => playlist.tracks)
  playlists: Playlist[];

  @ManyToMany(() => User, (user) => user.likedTracks)
  likedBy: User[];

  @OneToMany(() => ArtistRoleAssignment, (assignment) => assignment.role)
  assignments: ArtistRoleAssignment[];
  //   @OneToMany(() => ListeningHistory, (history) => history.song)
  //   listeningHistory: ListeningHistory[];
}
