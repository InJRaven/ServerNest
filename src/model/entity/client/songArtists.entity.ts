import { ArtistsEntity } from './artists.entity';
import { SongEntity } from './song.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'SongArtists' })
class SongArtistsEntity {
  @PrimaryGeneratedColumn('uuid')
  song_id: string;

  @PrimaryGeneratedColumn('uuid')
  artist_id: string;

  @Column({
    type: 'enum',
    enum: ['main', 'featured', 'composer', 'producer'],
    default: 'main',
    nullable: true,
  })
  role: 'main' | 'featured' | 'composer' | 'producer';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SongEntity, (song) => song.song_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: SongEntity;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.song_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;
}

export { SongArtistsEntity };
