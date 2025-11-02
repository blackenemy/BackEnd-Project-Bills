import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Bill } from '../../bills/entities/bill.entity';
import { User } from '../../user/entities/user.entity';
import { BillLogAction } from '../../common/enum/bill-enum';

@Entity('bill_logs')
export class BillLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, (bill) => bill.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @Column({ name: 'bill_id', nullable: true })
  bill_id: number | null;

  @Column({ name: 'action', enum: BillLogAction })
  action: BillLogAction;

  @ManyToOne(() => User, (user) => user.billLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  user_id: number | null;

  @Column({ name: 'old_status', nullable: true })
  old_status: string;

  @Column({ name: 'new_status', nullable: true })
  new_status: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
