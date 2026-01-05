import { Artist, Track } from '@CoreEntities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('artist_tracks')
@Index('idx_artist_tracks_artist_main_artist', ['artistId', 'isMainArtist'])
@Index('idx_artist_tracks_track', ['trackId'])
@Index('idx_artist_tracks_artist_addAt', ['addedAt'])
export class ArtistTrack {
  @PrimaryColumn('uuid')
  artistId: string;

  @PrimaryColumn('uuid')
  trackId: string;

  @Column({ default: false })
  isMainArtist: boolean;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  addedAt: Date;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Track, (t) => t.artists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
