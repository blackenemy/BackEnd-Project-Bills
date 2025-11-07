import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BillLog } from '../../bill_logs/entities/bill_log.entity';
import { BillFollower } from '../../bill_followers/entities/bill_follower.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type_bill' })
  type_bill: string;

  @Column({ name: 'name_bill' })
  name_bill: string;

  @Column({ name: 'customer_name' })
  customer_name: string;

  @Column({ name: 'date', type: 'timestamp' })
  date: Date;

  @Column({ name: 'products', type: 'json' })
  products: Array<{ name: string; price: number; amount: number }>;

  @Column({ name: 'sum_amount', type: 'int' })
  sum_amount: number;

  @Column({ name: 'sum_total', type: 'decimal', precision: 10, scale: 2 })
  sum_total: number;

  @Column({ name: 'status', nullable: true })
  status: string; // เช่น 'รอดำเนินการ', 'ผ่าน', 'ไม่ผ่าน', 'ยกเลิก'

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'create_by' })
  created_by: User | null;

  @Column({ name: 'create_by', nullable: true })
  create_by: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at?: Date;
  
  @OneToMany(() => BillLog, (log) => log.bill)
  logs: BillLog[];

  @OneToMany(() => BillFollower, (follower) => follower.bill)
  followers: BillFollower[];
}