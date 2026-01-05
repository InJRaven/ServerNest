import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@base';
import { Playlist, Track } from '@CoreEntities';

@Entity('users')
@Index('idx_user_id', ['id'])
@Index('idx_user_username', ['username'], { unique: true })
@Index('idx_user_email', ['email'], { unique: true })
@Index('idx_user_isDeleted', ['isDeleted'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 512, nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  // Relations
  @OneToMany(() => Playlist, (playlist) => playlist.creator)
  playlists: Playlist[];

  //   @OneToMany(() => ListeningHistory, (history) => history.user)
  //   listeningHistory: ListeningHistory[];

  //   @OneToMany(() => UserSubscription, (sub) => sub.user)
  //   subscriptions: UserSubscription[];

  @ManyToMany(() => Track, (track) => track.likedBy)
  @JoinTable({ name: 'track_likes' })
  likedTracks: Track[];

  //   @ManyToMany(() => Artist, (artist) => artist.followers)
  //   @JoinTable({ name: 'user_follows_artists' })
  //   followedArtists: Artist[];

  //   @ManyToMany(() => User, (user) => user.followers)
  //   @JoinTable({ name: 'user_follows_users' })
  //   followers: User[];

  //   @ManyToMany(() => User, (user) => user.following)
  //   following: User[];
}
