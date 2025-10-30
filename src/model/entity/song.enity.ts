import { SongGenresEnity } from './songGenres.enity';
import { AlbumsEnity } from './albums.enity';
import { SongArtistsEnity } from './songArtists.enity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'Songs' })
class SongEnity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  album_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  track_no: number;

  @Column({ nullable: false })
  file_url: string;

  @Column({ nullable: true })
  lyrics: string;

  @Column({ default: false, nullable: true })
  is_explicit: boolean; //contains sensitive content (18+)

  @Column({ nullable: true })
  bpm: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AlbumsEnity, (album) => album.songs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumsEnity;

  @OneToMany(() => SongArtistsEnity, (songArtist) => songArtist.artist)
  song_artists: SongArtistsEnity[];

  @OneToMany(() => SongGenresEnity, (songGenre) => songGenre.song)
  song_genres: SongGenresEnity[];
}
export { SongEnity };
