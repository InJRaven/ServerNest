import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { AlbumsEntity } from './albums.entity';
import { TrackArtistsEntity } from './track-artists.entity';
@Entity({ name: 'Artists' })
@Index(['popularity', 'monthly_listeners'])
@Index(['title', 'slug'])
class ArtistsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  title: string;

  @Column({ unique: true, nullable: false })
  @Index()
  slug: string;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  header_image_url: string;

  @Column({ type: 'json', nullable: true })
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  monthly_listeners: number;

  @Column({ type: 'bigint', default: 0 })
  @Index()
  followers: number;

  @Column({ type: 'int', default: 0 })
  @Index()
  popularity: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'json', nullable: true })
  genres: string[];

  @Column({ type: 'json', nullable: true })
  external_urls: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'date' })
  debut_date: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @Column({ default: false })
  @Index()
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AlbumsEntity, (albums) => albums.artist)
  albums: AlbumsEntity[];

  @OneToMany(() => TrackArtistsEntity, (trackArtists) => trackArtists.artist_id)
  track_artists: TrackArtistsEntity[];
}
export { ArtistsEntity };
