import { ArtistsEnity } from '@/model/entity/artists.enity';
import { SongEnity } from '@/model/entity/song.enity';
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
class SongArtistsEnity {
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

  @ManyToOne(() => SongEnity, (song) => song.song_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: SongEnity;

  @ManyToOne(() => ArtistsEnity, (artist) => artist.song_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEnity;
}

export { SongArtistsEnity };
