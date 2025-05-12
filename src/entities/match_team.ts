import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column,BeforeInsert } from "typeorm";
import type { Match } from "./match";
import { Team } from "./team";
import {v4 as uuidv4}from "uuid"

@Entity()
export class MatchTeam {
    @PrimaryColumn('uuid')
    match_id: string;

    @PrimaryColumn('uuid')
    team_id: string;

    @Column({ length: 50 })
    team_role: string;

    @ManyToOne(
        () => require("./match").Match,                  // <-- dynamic require
        (m: Match) => m.matchTeams
      )
      @JoinColumn({ name: "match_id" })
      match!: Match;

    @ManyToOne("Team","matchTeams")
    @JoinColumn({ name: "team_id" })
    team: Team;
    
}