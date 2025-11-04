import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'firstname', nullable: false })
  firstname: string;

  @Column({ name: 'lastname', nullable: false })
  lastname: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'payment', nullable: true })
  payment: string;

  @Column({ name: 'bank', nullable: true })
  bank: string;

  @Column({ name: 'account', nullable: true })
  account: string;

  @Column({ name: 'create_by', nullable: true })
  create_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'create_by' })
  created_by: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
