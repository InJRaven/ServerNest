import { Track, User } from '@CoreEntities';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('track_likes')
@Index('idx_track_likes_user', ['userId'])
@Index('idx_track_likes_track', ['trackId'])
export class TrackLike {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  trackId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
