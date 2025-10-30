import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AlbumsEnity } from './albums.enity';
import { SongArtistsEnity } from './songArtists.enity';
@Entity({ name: 'Artists' })
class ArtistsEnity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  debut_date: Date;

  @Column({ nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AlbumsEnity, (albums) => albums.artist)
  albums: AlbumsEnity[];

  @OneToMany(() => SongArtistsEnity, (songArtists) => songArtists.artist_id)
  song_artists: SongArtistsEnity[];
}
export { ArtistsEnity };
