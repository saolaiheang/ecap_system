import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import { Team } from "./team";
import { v4 as uuidv4 } from 'uuid';
import { SportType } from "./typeOfsport";

@Entity()
export class Player {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 200, nullable: false })
    name: string;

    @Column({ length: 250 })
    position: string;

    @Column()
    team_id: string;
    @Column({nullable:true})
    sport_id: string;

    @Column({ length: 250 })
    contact_info: string;
    @Column({nullable:true})
    image:string;

    @ManyToOne("Team", "players")
    @JoinColumn({ name: "team_id" })
    team: Team;
    @ManyToOne("SportType", "players")
    @JoinColumn({ name: "sport_id" })
    sport: SportType;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}