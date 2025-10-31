import { ArtistsEntity } from './artists.entity';
import { SongEntity } from './song.entity';
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
class AlbumsEntity {
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

  @ManyToOne(() => ArtistsEntity, (artist) => artist.albums, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;

  @OneToMany(() => SongEntity, (song) => song.album)
  songs: SongEntity[];
}
export { AlbumsEntity };
