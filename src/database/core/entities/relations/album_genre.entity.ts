import { Album, Genre } from '@CoreEntities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('album_genres')
@Index('album_genres_album', ['albumId'])
@Index('album_genres_genre', ['genreId'])
export class AlbumGenre {
  @PrimaryColumn('uuid')
  albumId: string;

  @PrimaryColumn('uuid')
  genreId: string;

  @Column({ default: false })
  isPrimary: boolean; // main genre for the album

  @ManyToOne(() => Album, (album) => album.albumGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @ManyToOne(() => Genre, (genre) => genre.albumGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
