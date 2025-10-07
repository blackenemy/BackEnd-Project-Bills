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
  @JoinColumn({name:'bill_Id'})
  bill: Bill;

  @Column({name:'bill_Id'})
  bill_Id:number;

  @Column({ name:'action', enum: BillLogAction })
  action: BillLogAction; // เช่น created, updated, deleted, status_changed

  @ManyToOne(() => User, (user) => user.billLogs, { onDelete: 'SET NULL' })
  @JoinColumn({name:'user_Id'})
  user: User;

  @Column({name:'userId'})
  user_Id: string;

  @Column({ name:'old_status', nullable: true })
  old_status: string;

  @Column({ name:'new_status', nullable: true })
  new_status: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @CreateDateColumn({ name:'createAt', type: 'timestamp' })
  created_at: Date;
}
