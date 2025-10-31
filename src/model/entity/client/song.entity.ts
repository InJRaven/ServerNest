import { SongGenresEntity } from './songGenres.entity';
import { AlbumsEntity } from './albums.entity';
import { SongArtistsEntity } from './songArtists.entity';
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
class SongEntity {
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

  @ManyToOne(() => AlbumsEntity, (album) => album.songs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumsEntity;

  @OneToMany(() => SongArtistsEntity, (songArtist) => songArtist.artist)
  song_artists: SongArtistsEntity[];

  @OneToMany(() => SongGenresEntity, (songGenre) => songGenre.song)
  song_genres: SongGenresEntity[];
}
export { SongEntity };
