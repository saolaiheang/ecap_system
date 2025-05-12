


import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import { SportType } from "./typeOfsport";
import { v4 as uuid } from "uuid";

@Entity()
export class Competition {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column()
    sport_type_id: string;

    @Column({ type: "date" })
    start_date: Date;

    @Column({ length: 200 })
    location: string;

    @Column({nullable:true})
    image:string;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;
    @BeforeInsert()
    generateId() {
        this.id = uuid();
    }
}