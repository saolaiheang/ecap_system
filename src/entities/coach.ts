


import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn,BeforeInsert } from "typeorm";
import { Team } from "./team";
import { v4 as uuid } from "uuid";
import { SportType } from "./typeOfsport";

@Entity()
export class Coach {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 200, nullable: false })
    name: string;

    @Column({ length: 200 })
    contact_info: string;

    @Column({nullable:true})
    image:string;
    @Column({nullable:true})
    sport_id: string;

    @ManyToOne("Team", "coaches")
    @JoinColumn({ name: "team_id" })
    team: Team;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_id" })
    sport: SportType;

    @BeforeInsert()
    generateId() {
        this.id = uuid();
    }
}