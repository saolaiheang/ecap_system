import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { SportType } from "./typeOfsport";
import { Team } from "./team";
import {v4 as uuidv4} from "uuid"
export enum MatchStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
  }
@Entity()
export class MatchFriendly {
    @PrimaryColumn("uuid")
    id: string;

    @Column({type:"date"})
    match_date:Date;

    @Column({type:"time"})
    match_time:string;

    @Column({length:255})
    location:string;

    @Column({type:"enum",enum:MatchStatus,default:MatchStatus.SCHEDULED})
    status:MatchStatus;

    @Column({nullable:false})
    teamA_id:string;

    @Column({nullable:false})
    teamB_id:string;

    @Column({type:"int",nullable:true})
    teamA_score: number;

    @Column({type:"int",nullable:true})
    teamB_score: number;

    @Column()
    sport_type_id: string;


    @ManyToOne(() => SportType, { nullable: false })
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;
  
    @ManyToOne(()=>Team,{nullable:false})
    @JoinColumn({name:"teamA_id"})
    teamA:Team;
    
    @ManyToOne(()=>Team,{nullable:false})
    @JoinColumn({name:"teamB_id"})  
    teamB:Team;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @Column({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date
  
    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }

}