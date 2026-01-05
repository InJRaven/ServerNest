import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { Artist } from '@CoreEntities';
import { AlbumTracks } from './relations/album_tracks.entity';
import { AlbumGenre } from './relations/album_genre.entity';

@Entity('albums')
@Index('idx_album_id', ['id'])
@Index('idx_album_slug', ['slug'], { unique: true })
@Index('idx_album_releaseDate', ['releaseDate'])
@Index('idx_album_popularity', ['popularity'])
@Index('idx_album_isDeleted', ['isDeleted'])
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, nullable: true })
  slug?: string;

  @Column({ type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({
    type: 'enum',
    enum: ['album', 'single', 'ep', 'compilation'],
    default: 'album',
  })
  @Index()
  type: 'album' | 'single' | 'ep' | 'compilation';

  @Column({ nullable: true })
  label: string;

  @Column({ length: 512, nullable: true })
  coverUrl?: string;

  @Column({ default: 0 })
  totalTracks: number;

  @Column({ default: 0 })
  totalDuration: number; // seconds

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  popularity: number;

  @Column({ nullable: false, type: 'date' })
  release_date: Date;

  @Column({
    type: 'enum',
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  external_urls: {
    youtube?: string;
    spotify?: string;
    apple_music?: string;
    soundcloud?: string;
  };

  // Relations
  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
  })
  @JoinColumn({ name: 'main_artist_id' })
  mainArtist?: Artist;

  @OneToMany(() => AlbumTracks, (at) => at.album)
  albumTracks: AlbumTracks[];

  @OneToMany(() => AlbumGenre, (ag) => ag.album)
  albumGenres: AlbumGenre[];
}
