import { Genre, Track } from '@CoreEntities';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('track_genres')
@Index('idx_track_genres_track', ['trackId'])
@Index('idx_track_genres_genre', ['genreId'])
export class TrackGenre {
  @PrimaryColumn('uuid')
  trackId: string;

  @PrimaryColumn('uuid')
  genreId: string;

  @ManyToOne(() => Track, (t) => t.trackGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @ManyToOne(() => Genre, (g) => g.trackGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
