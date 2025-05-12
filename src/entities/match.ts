// import {
//   Entity,
//   PrimaryColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   BeforeInsert,
// } from "typeorm";
// import { TypeOfSport } from "./typeOfsport"; 
// import { Team } from "./team";
// import { v4 as uuidv4 } from "uuid";


// @Entity('matches')
// export class Match {
//   @PrimaryColumn('uuid')
//   id: string;

//   @ManyToOne(() => Team, (team) => team.matchesAsTeamA)
//   @JoinColumn({ name: 'teamAId' })
//   teamA: Team;

//   @Column()
//   teamAId: string;

//   @ManyToOne(() => Team, (team) => team.matchesAsTeamB)
//   @JoinColumn({ name: 'teamBId' })
//   teamB: Team;

//   @Column()
//   teamBId: string;

//   @Column({ type: 'date' })
//   date_match: string;

//   @Column({ type: 'time' })
//   time_match: string;

//   @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.matches)
//   @JoinColumn({ name: 'type_of_sport_id' })
//   typeOfSport: TypeOfSport;

//   @Column()
//   typeOfSportId: string;

//   @Column({ nullable: true })
//   location: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at: Date;

//   @Column({
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updated_at: Date;

//   @BeforeInsert()
//   generateId() {
//     this.id = uuidv4();
//   }
// }




import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert } from "typeorm";
import { Competition } from "./competition";
import { SportType } from "./typeOfsport";
import type { MatchTeam } from "./match_team";
import type { MatchResult } from "./match_result";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Match {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "date" })
  match_date: Date;

  @Column({ length: 255 })
  location: string;

  @Column()
  competition_id: string;

  @Column()
  sport_type_id: string;

  @ManyToOne(() => Competition)
  @JoinColumn({ name: "competition_id" })
  competition: Competition;

  @ManyToOne(() => SportType)
  @JoinColumn({ name: "sport_type_id" })
  sportType: SportType;



  @OneToMany(
    () => require("./match_team").MatchTeam,        // <-- dynamic require
    (mt: MatchTeam) => mt.match
  )
  matchTeams!: MatchTeam[];

  @OneToMany(
    () => require("./match_result").MatchResult,
    (mr: any) => mr.match
  )
  matchResults!: MatchResult[];
  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}