import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
  } from "typeorm";
  import { v4 as uuidv4 } from "uuid";
  import { Match } from "./match";
  import { TypeOfSport } from "./index";
  import { Competition } from "./index";
  import { Coach } from "./index";
  import { Player } from "./index";
  
  @Entity('teams')
export class Team {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  division: string;

  @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.teams)
  @JoinColumn({ name: 'type_of_sport_id' })
  typeOfSport: TypeOfSport;

  @Column()
  typeOfSportId: string;
  @Column()
  competitionId: string;
  @ManyToMany(() => Competition, (competition) => competition.teams)
  competitions: Competition[];

  @OneToMany(() => Match, (match) => match.teamA)
  matchesAsTeamA: Match[];
  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToMany(() => Match, (match) => match.teamB)
  matchesAsTeamB: Match[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Coach, (coach) => coach.teams)
  coaches: Coach[];

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