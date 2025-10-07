import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('bill_followers')
export class BillFollower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, (bill) => bill.followers, { onDelete: 'CASCADE' })
  bill: Bill;

  @ManyToOne(() => User, (user) => user.billFollowers, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
