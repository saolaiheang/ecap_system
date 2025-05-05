import { Entity, Column, PrimaryColumn,BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TypeOfSport {
  @PrimaryColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}