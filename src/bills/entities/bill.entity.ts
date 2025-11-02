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

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'amount', nullable: true })
  amount: string;

  @Column({ name: 'status', nullable: true })
  status: string; // เช่น 'รอดำเนินการ', 'ผ่าน', 'ไม่ผ่าน', 'ยกเลิก'

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'create_by' })
  created_by: User | null;

  @Column({ name: 'create_by', nullable: true })
  create_by: number;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at?: Date;
  
  @OneToMany(() => BillLog, (log) => log.bill)
  logs: BillLog[];

  @OneToMany(() => BillFollower, (follower) => follower.bill)
  followers: BillFollower[];
}