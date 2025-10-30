import { SongGenresEnity } from './songGenres.enity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'Genres' })
class GenresEnity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => SongGenresEnity, (songGenre) => songGenre.genre)
  song_genres: SongGenresEnity[];
}
export { GenresEnity };
