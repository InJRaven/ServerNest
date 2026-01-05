import { AlbumGenresEntity } from './album-genres.entity';
import { TrackGenresEntity } from './track-genres.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'Genres' })
class GenresEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @Index()
  title: string;

  @Column({ unique: true, nullable: false })
  @Index()
  slug: string;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cover_url: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'enum', enum: ['url', 'component'], default: 'component' })
  icon_type: 'url' | 'component';

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon_value: string;

  @Column({ type: 'int', default: 0 })
  @Index()
  popularity: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  track_count: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  album_count: number;

  @Column({ type: 'json', nullable: true })
  related_genres: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  @Index()
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TrackGenresEntity, (trackGenre) => trackGenre.genre)
  track_genres: TrackGenresEntity[];

  @OneToMany(() => AlbumGenresEntity, (albumGenre) => albumGenre.genre)
  album_genres: AlbumGenresEntity[];
}
export { GenresEntity };
