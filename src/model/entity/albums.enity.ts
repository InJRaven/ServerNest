import { ArtistsEnity } from '@/model/entity/artists.enity';
import { SongEnity } from '@/model/entity/song.enity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'Albums' })
class AlbumsEnity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  artist_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  release_date: Date;

  @Column({ nullable: false })
  cover_url: string;

  @Column({ default: false, nullable: true })
  is_explicit: boolean; //contains sensitive content (18+)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ArtistsEnity, (artist) => artist.albums, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEnity;

  @OneToMany(() => SongEnity, (song) => song.album)
  songs: SongEnity[];
}
export { AlbumsEnity };
