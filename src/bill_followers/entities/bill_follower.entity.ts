import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('bill_followers')
export class BillFollower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, (bill) => bill.followers, { onDelete: 'CASCADE' })
  @JoinColumn({name:'bill_id'})
  bill: Bill;

  @ManyToOne(() => User, (user) => user.billFollowers, { onDelete: 'CASCADE' })
  @JoinColumn({name:'user_id'})
  user: User;

  @CreateDateColumn({ name:'createAt',type: 'timestamp' })
  created_at: Date;
}
