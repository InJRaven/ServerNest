import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Admin' })
class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

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

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'en', nullable: true })
  language: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'manager', 'mod', 'guest'],
    default: 'admin',
    nullable: true,
  })
  roles: 'admin' | 'manager' | 'mod' | 'guest';

  @Column({ default: false, nullable: true })
  is_super_admin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { AdminEntity };
