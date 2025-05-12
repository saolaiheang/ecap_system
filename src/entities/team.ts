

import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn,BeforeInsert } from "typeorm";
import { SportType } from "./typeOfsport";
import { Player } from "./player";
import { Coach } from "./coach";
import { ScheduleTraining } from "./schedule_training";
import { MatchTeam } from "./match_team";
import {v4 as uuidv4} from'uuid'

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

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;

    @OneToMany("Player", "team")
    players: Player[];

    @OneToMany("Coach","team")
    coaches: Coach[];

    @OneToMany("ScheduleTraining","team")
    scheduleTrainings: ScheduleTraining[];

    @OneToMany('MatchTeam','team')
    matchTeams: MatchTeam[];

    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }
}