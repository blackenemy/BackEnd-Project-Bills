import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BillLog } from 'src/bill_logs/entities/bill_log.entity';
import { BillFollower } from 'src/bill_followers/entities/bill_follower.entity';

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
  @JoinColumn({name:'create_by'})
  created: User | null;

  @Column({name:'createBy', nullable: true})
  create_by: string;

  @CreateDateColumn({ name: 'createAt', type: 'timestamp' })
  created_At: Date;

  @UpdateDateColumn({ name: 'updateAt', type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => BillLog, (log) => log.bill)
  logs: BillLog[];

  @OneToMany(() => BillFollower, (follower) => follower.bill)
  followers: BillFollower[];
}
