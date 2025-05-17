import { Entity,PrimaryColumn,Column,BeforeInsert,CreateDateColumn,UpdateDateColumn } from "typeorm";
import {v4 as uuid} from "uuid";
@Entity()
export class History{
    @PrimaryColumn("uuid")
    id:string;
    @Column()
    year: string;
  
    @Column({ type: "varchar", length: 255 })
    title: string;
  
    @Column({ type: "text" })
    description: string;
  
    @Column({ type: "varchar", length: 255, nullable: true })
    imageUrl: string;  
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
    @BeforeInsert()
    generateId(){
        this.id=uuid()
    }
}