import { Playlist, Track } from '@CoreEntities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('playlist_tracks')
@Index('idx_playlist_tracks_playlist', ['playlistId'])
@Index('idx_playlist_tracks_track', ['trackId'])
export class PlaylistTrack {
  @PrimaryColumn('uuid')
  playlistId: string;

  @PrimaryColumn('uuid')
  trackId: string;

  @Column({ type: 'integer' })
  position: number;

  @ManyToOne(() => Playlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlistId' })
  playlist: Playlist;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
