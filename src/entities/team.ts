

import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn,BeforeInsert } from "typeorm";
import { SportType } from "./typeOfsport";
import { Player } from "./player";
import { Coach } from "./coach";
import { Match } from "./match";
import { ScheduleTraining } from "./schedule_training";
import {v4 as uuidv4} from'uuid'
import { match } from "assert";

@Entity()
export class Team {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 200, nullable: false })
    name: string;

    @Column({ length: 50 })
    division: string;

    @Column({ length: 300 })
    contact_info: string;
    @Column({nullable:true})
    image:string;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;

    @OneToMany("Player", "team")
    players: Player[];
    @OneToMany(() => Match, (match) => match.teamA)
    teamA_matches: Match[];
    @OneToMany(() =>Match,(match)=>match.teamB)
    teamB_matches:Match[];

    @OneToMany("Coach","team")
    coaches: Coach[];

    @OneToMany("ScheduleTraining","team")
    scheduleTrainings: ScheduleTraining[];


    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }
}