import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import { SportType } from "./typeOfsport";
import { Team } from "./team";
import { v4 as uuidv4 } from "uuid";
import { Coach } from "./coach";

@Entity()
export class ScheduleTraining {
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    sport_type_id: string;

    @Column()
    team_id: string;

    @Column()
    date:string;

    @Column({ length: 200 })
    time: string;

    @Column()
    coach_id:string;

    @Column({ length: 200 })
    location: string;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;
    
    @ManyToOne(()=>Coach)
    @JoinColumn({name:"coach_id"})
    coach:Coach;

    @ManyToOne("Team","scheduleTrainings")
    @JoinColumn({ name: "team_id" })
    team: Team;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}