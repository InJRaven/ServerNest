import { ArtistsEntity } from './artists.entity';
import { TracksEntity } from './tracks.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'TrackArtists' })
class TrackArtistsEntity {
  @PrimaryColumn('uuid')
  track_id: string;

  @PrimaryColumn('uuid')
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

  @ManyToOne(() => TracksEntity, (track) => track.track_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'track_id' })
  track: TracksEntity;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.track_artists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;
}

export { TrackArtistsEntity };
