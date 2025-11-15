// src/entities/albumGenres.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { AlbumsEntity } from './albums.entity';
import { GenresEntity } from './genres.entity';

@Entity({ name: 'AlbumGenres' })
@Index(['album_id', 'genre_id'], { unique: true }) // Không cho duplicate
class AlbumGenresEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Index()
  album_id: string;

  @Column({ nullable: false })
  @Index()
  genre_id: string;

  @Column({ default: false })
  is_primary: boolean; // Genre chính của album

  @Column({ type: 'int', nullable: true })
  weight: number; // Độ quan trọng (0-100), dùng để sort

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => AlbumsEntity, (album) => album.album_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumsEntity;

  @ManyToOne(() => GenresEntity, (genre) => genre.album_genres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'genre_id' })
  genre: GenresEntity;
}

export { AlbumGenresEntity };
