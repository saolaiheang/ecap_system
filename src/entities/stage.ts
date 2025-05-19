import { Entity, Column, PrimaryColumn, BeforeInsert, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid'
import { Competition } from "./competition";
import { Match } from "./match";

export enum StageType {
    GROUP = "group",
    SEMIFINAL = "semifinal",
    FINAL = "final",
}
@Entity()
export class Stage {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ length: 100, nullable: false, unique: true })
    name: string;

    @Column({ type: "enum", enum: StageType, default: StageType.GROUP })
    type: StageType;

    @Column()
    competition_id: string
    
    @ManyToOne(() => Competition)
    @JoinColumn({ name: "competition_id" })
    competition: Competition;

    @OneToMany(() => Match, (match) => match.stage)
    matches: Match[];

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }


}