import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { TrackGenre } from './relations/track_genres.entity';
import { AlbumGenre } from './relations/album_genre.entity';

@Entity('genres')
@Index('idx_genre_id', ['id'])
@Index('idx_genre_identify', ['identify'])
@Index('idx_genre_name', ['name'], { unique: true })
@Index('idx_genre_slug', ['slug'], { unique: true })
@Index('idx_genre_isDeleted', ['isDeleted'])
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  identify: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  coverUrl?: string;

  // ── Relationships ───────────────────────────────────────────────────
  @OneToMany(() => TrackGenre, (tg) => tg.genre, { cascade: true })
  trackGenres: TrackGenre[];

  @OneToMany(() => AlbumGenre, (ag) => ag.genre, { cascade: true })
  albumGenres: AlbumGenre[];
}
