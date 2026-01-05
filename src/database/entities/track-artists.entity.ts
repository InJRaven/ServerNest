import { ArtistsEntity } from './artists.entity';
import { TracksEntity } from './tracks.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'TrackArtists' })
class TrackArtistsEntity {
  @PrimaryColumn('uuid')
  track_id: string;

  @PrimaryColumn('uuid')
  artist_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  role: string;

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
