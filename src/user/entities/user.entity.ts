import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Bill } from 'src/bills/entities/bill.entity';
import { BillLog } from 'src/bill_logs/entities/bill_log.entity';
import { BillFollower } from 'src/bill_followers/entities/bill_follower.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'password', select: false, nullable: true })
  password: string;

  @Column({ name: 'firstName', nullable: true })
  firstName: string;

  @Column({ name: 'lastName', nullable: true })
  lastName: string;

  @Column({ name: 'role', nullable: true })
  role: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_At: Date;

  @Column({
    name: 'updatedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_At: Date;

  @OneToMany(() => Bill, (bill) => bill.created)
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
