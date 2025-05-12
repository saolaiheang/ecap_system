// import { Entity, Column, PrimaryColumn,BeforeInsert, OneToMany } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { News } from './news';
// import { Match } from './match';
// import { Team } from './team';
// import { Competition } from './competition';

// @Entity('sport_types')
// export class TypeOfSport {
//   @PrimaryColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   name: string;

//   @Column({ type: 'text', nullable: true })
//   description: string;

//   @OneToMany(() => News, (news) => news.typeOfSport)
//   news: News[];

//   @OneToMany(() => Match, (match) => match.typeOfSport)
//   matches: Match[];

//   @OneToMany(() => Competition, (competition) => competition.typeOfSport)
//   competitions: Competition[];

//   @OneToMany(() => Team, (team) => team.typeOfSport)
//   teams: Team[];

//   @OneToMany(() => Match, (match) => match.typeOfSport)
//   matchList: Match[];  

//   @OneToMany(() => Competition, (competition) => competition.typeOfSport)
//   match: Competition[];

//   @BeforeInsert()
//   generateId() {
//     this.id = uuidv4();
//   }
// }

import { Entity, PrimaryColumn, Column ,BeforeInsert} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class SportType {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ length: 255, nullable: false })
    name: string;
    @Column({ length: 1000 })
    description: string;
    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

}