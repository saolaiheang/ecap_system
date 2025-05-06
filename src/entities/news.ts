import { Entity,Column,PrimaryColumn,BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { TypeOfSport } from "./index";  
@Entity("news")
export class News {
    @PrimaryColumn()
    id:string;
    @Column()
    title:string;
    @Column()
    description:string;
    @Column()
    image:string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at:Date;
    @ManyToOne(() => TypeOfSport, type => type.news, { eager: true })
    @JoinColumn({ name: "type_of_sport_id" })
    typeOfSport: TypeOfSport;
    @BeforeInsert()
    addId(){
        this.id=uuidv4();
    }
}