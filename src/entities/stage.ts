import {Entity, Column,PrimaryColumn,BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid'
import { Competition } from "./competition";


@Entity()
export class Stage {
    save() {
        throw new Error("Method not implemented.");
    }
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;
    @Column()
    competition_id:string
    @ManyToOne(()=>Competition)
    @JoinColumn({name:"competition_id"})
    competition:Competition;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}