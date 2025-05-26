import { Column, Entity, PrimaryColumn, BeforeInsert, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { SportType } from "./typeOfsport";


@Entity()
export class Activities {
    @PrimaryColumn("uuid")
    id: string;
    @Column({ length: 255 })
    title: string;
    @Column({ length: 300 })
    description: string;
    @Column({ length: 255})
    video: string;
    @CreateDateColumn()
    create_at: Date;
    @Column({ nullable: true })
    sport_id: string;
    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_id" })
    sportType: SportType;
    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}