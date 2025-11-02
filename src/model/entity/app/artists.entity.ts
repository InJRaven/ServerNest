import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AlbumsEntity } from './albums.entity';
import { SongArtistsEntity } from './songArtists.entity';
@Entity({ name: 'Artists' })
class ArtistsEntity {
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

  @OneToMany(() => AlbumsEntity, (albums) => albums.artist)
  albums: AlbumsEntity[];

  @OneToMany(() => SongArtistsEntity, (songArtists) => songArtists.artist_id)
  song_artists: SongArtistsEntity[];
}
export { ArtistsEntity };
