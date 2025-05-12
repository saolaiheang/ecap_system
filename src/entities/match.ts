
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert } from "typeorm";
import { Stage } from "./stage";
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
  stage_id: string;

  @Column()
  sport_type_id: string;

  @ManyToOne(() => Stage)
  @JoinColumn({ name: "stage_id" })
  stage: Stage;

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