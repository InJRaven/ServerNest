import { Album, Track } from '@CoreEntities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('album_tracks')
@Index('idx_album_track_album_track', ['albumId', 'discNumber', 'trackNumber']) // Fast ordering within album
@Index('idx_album_track_track', ['trackId'])
export class AlbumTracks {
  @PrimaryColumn('uuid')
  albumId: string;

  @PrimaryColumn('uuid')
  trackId: string;

  @Column({ type: 'smallint' })
  trackNumber: number;

  @Column({ type: 'smallint', default: 1 })
  discNumber: number;

  @Column({ length: 100, nullable: true })
  version?: string;

  @ManyToOne(() => Album, (a) => a.albumTracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @ManyToOne(() => Track, (t) => t.albumTracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
