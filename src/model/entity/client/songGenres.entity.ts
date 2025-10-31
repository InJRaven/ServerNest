import { GenresEntity } from './genres.entity';
import { SongEntity } from './song.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
@Entity({ name: 'SongGenres' })
class SongGenresEntity {
  @PrimaryColumn('uuid')
  song_id: string;

  @PrimaryColumn('uuid')
  genre_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SongEntity, (song) => song.song_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: SongEntity;

  @ManyToOne(() => GenresEntity, (genre) => genre.song_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'genre_id' })
  genre: GenresEntity;
}
export { SongGenresEntity };
