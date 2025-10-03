import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({name: 'username', nullable: true})
  username: string;

  @Column({name: 'password', nullable: true})
  password: string;

  @Column({name: 'firstName', nullable: true})
  firstName: string;

  @Column({name: 'lastName', nullable: true})
  lastName: string;

  @Column({name: 'role', nullable: true})
  role: string;

  @Column({name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_At: Date;

  @Column({name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updated_At: Date;
}
