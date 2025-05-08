import { Entity, Column, PrimaryColumn,BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { News } from './index';
import { Match } from './index';
import { Team } from './index';
import { Competition } from './index';

@Entity('sport_types')
export class TypeOfSport {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => News, (news) => news.typeOfSport)
  news: News[];

  @OneToMany(() => Match, (match) => match.typeOfSport)
  matches: Match[];

  @OneToMany(() => Competition, (competition) => competition.typeOfSport)
  competitions: Competition[];

  @OneToMany(() => Team, (team) => team.typeOfSport)
  teams: Team[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}