import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
  } from "typeorm";
  import { v4 as uuidv4 } from "uuid";
  import { Team } from "./team";
  
  @Entity("players")
  export class Player {
    @PrimaryColumn()
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    position: string;
  
    @Column()
    contact_info: string;
  
    @ManyToOne(() => Team, (team) => team.players, {
      cascade: true,
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "team_id" })
    team: Team;
  
    @BeforeInsert()
    generateId() {
      this.id = uuidv4();
    }
  }
  