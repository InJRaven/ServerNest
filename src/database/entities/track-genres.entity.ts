import { GenresEntity } from './genres.entity';
import { TracksEntity } from './tracks.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
@Entity({ name: 'TrackGenres' })
class TrackGenresEntity {
  @PrimaryColumn('uuid')
  track_id: string;

  @PrimaryColumn('uuid')
  genre_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TracksEntity, (track) => track.track_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'track_id' })
  track: TracksEntity;

  @ManyToOne(() => GenresEntity, (genre) => genre.track_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'genre_id' })
  genre: GenresEntity;
}
export { TrackGenresEntity };
