import { AlbumGenresEntity } from './album-genres.entity';
import { ArtistsEntity } from './artists.entity';
import { TracksEntity } from './tracks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';

@Entity({ name: 'Albums' })
@Index(['popularity', 'total_plays'])
@Index(['title', 'slug'])
class AlbumsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  artist_id: string;

  @Column({ nullable: false })
  @Index()
  title: string;

  @Column({ unique: true, nullable: false })
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ nullable: false })
  cover_url: string;

  @Column({ nullable: true })
  cover_high_res_url: string;

  @Column({ nullable: false, type: 'date' })
  release_date: Date;

  @Column({ default: false, nullable: true })
  is_explicit: boolean; //contains sensitive content (18+)

  @Column({
    type: 'enum',
    enum: ['album', 'single', 'ep', 'compilation'],
    default: 'album',
  })
  @Index()
  album_type: string;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'int', default: 0 })
  total_tracks: number;

  @Column({ type: 'int', default: 0 })
  duration_total: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  total_plays: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  total_likes: number;

  @Column({ type: 'int', default: 0 })
  @Index()
  popularity: number;

  @Column({ type: 'json', nullable: true })
  genres: string[];

  @Column({ type: 'json', nullable: true })
  external_urls: {
    youtube?: string;
    spotify?: string;
    apple_music?: string;
    soundcloud?: string;
  };

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  credits: Array<{
    role: string;
    name: string;
  }>;

  @Column({
    type: 'enum',
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
  })
  status: string;

  @Column({ default: false })
  @Index()
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.albums, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity; // PROPERTY RELATIONSHIP

  @OneToMany(() => TracksEntity, (track) => track.album)
  tracks: TracksEntity[]; // PROPERTY RELATIONSHIP

  @OneToMany(() => AlbumGenresEntity, (albumGenre) => albumGenre.album)
  album_genres: AlbumGenresEntity[]; // PROPERTY RELATIONSHIP
}
export { AlbumsEntity };
