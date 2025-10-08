import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/user/entities/user.entity';
import { BillLogAction } from 'src/common/enum/bill-enum';

@Entity('bill_logs')
export class BillLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, (bill) => bill.logs, { onDelete: 'CASCADE' })
  @JoinColumn({name:'billId'})
  bill: Bill;

  @Column({name:'billId', nullable: true})
  billId: number | null;

  @Column({ name:'action', enum: BillLogAction })
  action: BillLogAction; // เช่น created, updated, deleted, status_changed

  @ManyToOne(() => User, (user) => user.billLogs, { onDelete: 'SET NULL' })
  @JoinColumn({name:'userId'})
  user: User;

  @Column({name:'userId', nullable: true})
  userId: number | null;

  @Column({ name:'old_status', nullable: true })
  oldStatus: string;

  @Column({ name:'new_status', nullable: true })
  newStatus: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @CreateDateColumn({ name:'createAt', type: 'timestamp' })
  created_at: Date;
}
