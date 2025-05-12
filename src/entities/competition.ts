// import {
//   Entity,
//   PrimaryColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   BeforeInsert,
//   ManyToMany,
//   JoinTable,
// } from "typeorm";
// import { TypeOfSport } from "./typeOfsport";
// import { Team } from "./team";
// import { v4 as uuidv4 } from "uuid"
// @Entity("competitions")
// export class Competition {
//   @PrimaryColumn()
//   id: string;

//   @Column()
//   name: string;

//   @Column()
//   location: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   start_date: Date;
//   @ManyToOne(() => TypeOfSport, (typeOfSport) => typeOfSport.matches)
//   @JoinColumn({ name: 'type_of_sport_id' })
//   typeOfSport: TypeOfSport;
//   @ManyToMany(() => Team, (team) => team.competitions, {
//     cascade: true,
//   })
//   @JoinTable({
//     name: "competition_teams",
//     joinColumn: { name: "competition_id", referencedColumnName: "id" },
//     inverseJoinColumn: { name: "team_id", referencedColumnName: "id" },
//   })
//   teams: Team[];


//   @BeforeInsert()
//   generateId() {
//     this.id = uuidv4();
//   }
// }


import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn ,BeforeInsert} from "typeorm";
import { SportType } from "./typeOfsport";
import { v4 as uuid } from "uuid";

@Entity()
export class Competition {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column()
    sport_type_id: string;

    @Column({ type: "date" })
    start_date: Date;

    @Column({ length: 200 })
    location: string;

    @ManyToOne(() => SportType)
    @JoinColumn({ name: "sport_type_id" })
    sportType: SportType;
    @BeforeInsert()
    generateId() {
        this.id = uuid();
    }
}