
import { Entity, PrimaryColumn, Column ,BeforeInsert} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class SportType {
    @PrimaryColumn("uuid")
    id: string;
    @Column({ length: 255, nullable: false })
    name: string;
    @Column({nullable:true})
    image:string;
    @Column({ length: 1000 })
    description: string;
    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

}