

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import { SportType } from "./typeOfsport";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class News {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 1000 })
    description: string;

    @Column({ type: "date" })
    date: Date;
    @Column({ length: 255, nullable: true }) 
    image: string;

    @Column()
    sport_type_id: string;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}