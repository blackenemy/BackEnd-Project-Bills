import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Bill } from '../../bills/entities/bill.entity';
import { BillLog } from '../../bill_logs/entities/bill_log.entity';
import { BillFollower } from '../../bill_followers/entities/bill_follower.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'email', unique: true, nullable: true })
  email: string;

  @Column({ name: 'password', select: false, nullable: true })
  password: string;

  @Column({ name: 'firstname', nullable: true })
  firstname: string;

  @Column({ name: 'lastname', nullable: true })
  lastname: string;

  @Column({ name: 'role', nullable: true })
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => Bill, (bill) => bill.created_by)
  bills: Bill[];

  @OneToMany(() => BillLog, (log) => log.user)
  billLogs: BillLog[];

  @OneToMany(() => BillFollower, (follower) => follower.user)
  billFollowers: BillFollower[];

  static async hashPassword(
    plain: string,
    rounds = Number(process.env.BCRYPT_ROUNDS ?? 10),
  ) {
    return bcrypt.hash(plain, rounds);
  }
}
