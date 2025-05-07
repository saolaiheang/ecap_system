import { Entity, Column, PrimaryColumn,BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { News } from './index';
import { Match } from './index';

@Entity()
export class TypeOfSport {
  @PrimaryColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @OneToMany(() => News, news => news.typeOfSport)
  news: News[];
  @OneToMany(() => Match, (match) => match.typeOfSport)
  matches: Match[];
  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}