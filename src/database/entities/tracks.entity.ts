import { TrackGenresEntity } from './track-genres.entity';
import { AlbumsEntity } from './albums.entity';
import { TrackArtistsEntity } from './track-artists.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'Tracks' })
@Index(['popularity', 'play_count'])
@Index(['title', 'slug'])
class TracksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  album_id: string;

  @Column({ nullable: false })
  @Index()
  title: string;

  @Column({ unique: true, nullable: false })
  @Index()
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ nullable: false })
  duration: number;

  @Column({ nullable: false })
  track_no: number;

  @Column({ nullable: false })
  file_url: string;

  @Column({ nullable: true })
  cover_url: string;

  @Column({ nullable: true })
  lyrics: string;

  @Column({ default: false, nullable: true })
  is_explicit: boolean; //contains sensitive content (18+)

  @Column({ nullable: true })
  bpm: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  play_count: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  like_count: number;

  @Column({ type: 'int', default: 0 })
  @Index()
  popularity: number;

  @Column({ nullable: true, type: 'date' })
  release_date: Date;

  @Column({ type: 'json', nullable: true })
  external_urls: {
    youtube?: string;
    soundcloud?: string;
    apple_music?: string;
    tiktok?: string;
  };

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

  @ManyToOne(() => AlbumsEntity, (album) => album.tracks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumsEntity;

  @OneToMany(() => TrackArtistsEntity, (trackArtist) => trackArtist.track)
  track_artists: TrackArtistsEntity[];

  @OneToMany(() => TrackGenresEntity, (trackGenre) => trackGenre.track)
  track_genres: TrackGenresEntity[];
}
export { TracksEntity };
