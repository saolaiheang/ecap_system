import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('user')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['Admin', 'SuperAdmin', 'Public'], 
    default: 'Public',
  })
  role: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
