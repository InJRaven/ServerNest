import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'User' })
class UserEnity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  full_name: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column()
  occupation: string;

  @Column()
  company_name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'en', nullable: true })
  language: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'mod', 'guest'],
    default: 'user',
    nullable: true,
  })
  roles: 'admin' | 'user' | 'mod' | 'guest';

  @Column({ default: false, nullable: true })
  is_admin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { UserEnity };
