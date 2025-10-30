import { GenresEnity } from './genres.enity';
import { SongEnity } from './song.enity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
@Entity({ name: 'SongGenres' })
class SongGenresEnity {
  @PrimaryColumn('uuid')
  song_id: string;

  @PrimaryColumn('uuid')
  genre_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SongEnity, (song) => song.song_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: SongEnity;

  @ManyToOne(() => GenresEnity, (genre) => genre.song_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'genre_id' })
  genre: GenresEnity;
}
export { SongGenresEnity };
