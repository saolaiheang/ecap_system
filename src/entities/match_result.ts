import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import type{ Match } from "./match";
import { Team } from "./team";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class MatchResult {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ type: "date" })
    date: Date;

    @Column()
    match_id: string;

    @Column()
    teamA_id: string;

    @Column()
    teamB_id: string;

    @Column({ length: 200 })
    score_team_1: string;

    @Column({ length: 200 })
    score_team_2: string;

    @ManyToOne(
        () => require("./match").Match,
        (m: any) => m.matchResults
      )
      @JoinColumn({ name: "match_id" })
      match!:  Match;
    @ManyToOne(() => Team)
    @JoinColumn({ name: "teamA_id" })
    teamA: Team;

    @ManyToOne(() => Team)
    @JoinColumn({ name: "teamB_id" })
    teamB: Team;
    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}