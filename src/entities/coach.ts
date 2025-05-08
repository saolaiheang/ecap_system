import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    ManyToMany,
    JoinTable,
  } from "typeorm";
  import { v4 as uuid } from "uuid";
  import { Team } from "./team";
  @Entity('coaches')
  export class Coach {
    @PrimaryColumn()
    id: string;
    @Column()
    name: string;
    @Column()
    contact_info: string;
    @ManyToMany(() => Team, (team) => team.coaches, {
        cascade: true,
      })
      @JoinTable({
        name: "coach_teams",
        joinColumn: { name: "coach_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "team_id", referencedColumnName: "id" },
      })
      teams: Team[];


  }