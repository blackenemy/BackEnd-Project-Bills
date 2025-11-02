import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Bill } from '../../bills/entities/bill.entity';
import { User } from '../../user/entities/user.entity';

@Entity('bill_followers')
export class BillFollower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, (bill) => bill.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @Column({ name: 'bill_id', nullable: true })
  bill_id: number | null;

  @ManyToOne(() => User, (user) => user.billFollowers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  user_id: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
