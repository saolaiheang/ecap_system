import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert
  } from "typeorm";
  import { TypeOfSport } from "./index";
  import { v4 as uuidv4 } from 'uuid';
  @Entity("matches")
  export class Match {
    @PrimaryColumn()
    id: string;
    @Column()
    teamA: string;
    @Column()
    teamB: string;
    @Column()
    date_match:string;
    @Column()
    time_match: string;
    @Column()
    typeOfSportId: string;
    @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.matches)
    @JoinColumn({ name: "typeOfSportId" })
    typeOfSport: TypeOfSport;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @BeforeInsert()
    generateId() {
      this.id =uuidv4();
    }
  }