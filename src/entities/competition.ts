import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    ManyToMany,
    JoinTable,
  } from "typeorm";
  import { TypeOfSport } from "./typeOfsport";
  import { Team } from "./team";
  import{v4 as uuidv4} from"uuid"
  @Entity("competitions")
  export class Competition {
    @PrimaryColumn()
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    lacation: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    start_date: Date;
    @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.matches)
   @JoinColumn({ name: 'type_of_sport_id' })
   typeOfSport: TypeOfSport;
   @ManyToMany(() => Team, (team) => team.competitionId, {
    cascade: true,
  })
  @JoinTable({
    name: "competition_teams",
    joinColumn: { name: "competition_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "team_id", referencedColumnName: "id" },
  })
  teams: Team[];

  
    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }
  }