import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { TypeOfSport } from "./typeOfsport"; 
import { Team } from "./team";
import { v4 as uuidv4 } from "uuid";


@Entity('matches')
export class Match {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.matchesAsTeamA)
  @JoinColumn({ name: 'teamAId' })
  teamA: Team;

  @Column()
  teamAId: string;

  @ManyToOne(() => Team, (team) => team.matchesAsTeamB)
  @JoinColumn({ name: 'teamBId' })
  teamB: Team;

  @Column()
  teamBId: string;

  @Column({ type: 'date' })
  date_match: string;

  @Column({ type: 'time' })
  time_match: string;
  
  @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.matches)
  @JoinColumn({ name: 'type_of_sport_id' })
  typeOfSport: TypeOfSport;

  @Column()
  typeOfSportId: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
