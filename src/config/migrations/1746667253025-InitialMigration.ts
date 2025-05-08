import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746667253025 implements MigrationInterface {
    name = 'InitialMigration1746667253025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_types" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_293068ddae699e551f76783559e" UNIQUE ("name"), CONSTRAINT "PK_ac71fc905daf915674ac2652898" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL, "name" character varying NOT NULL, "division" character varying, "typeOfSportId" character varying NOT NULL, "competitionId" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_of_sport_id" uuid, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" uuid NOT NULL, "teamAId" uuid NOT NULL, "teamBId" uuid NOT NULL, "date_match" date NOT NULL, "time_match" TIME NOT NULL, "typeOfSportId" character varying NOT NULL, "location" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_of_sport_id" uuid, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competitions" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lacation" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "type_of_sport_id" uuid, CONSTRAINT "PK_ef273910798c3a542b475e75c7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coaches" ("id" character varying NOT NULL, "name" character varying NOT NULL, "contact_info" character varying NOT NULL, CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "players" ("id" character varying NOT NULL, "name" character varying NOT NULL, "position" character varying NOT NULL, "contact_info" character varying NOT NULL, "team_id" uuid, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coach_teams" ("coach_id" character varying NOT NULL, "team_id" uuid NOT NULL, CONSTRAINT "PK_a4ac0c0b64efc9284ece98cc8ec" PRIMARY KEY ("coach_id", "team_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e7ec949d71e23f5395bfa0b9e5" ON "coach_teams" ("coach_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef7e568d90de1d7586ab38ec0c" ON "coach_teams" ("team_id") `);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_5b332a90bd75f427de98445b5cb" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_a47eef6b6df80ec931e288f6350" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_71e3c30c26d5c72bd77479963eb" FOREIGN KEY ("teamAId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_6dad3cc6e21ab333537eb680d29" FOREIGN KEY ("teamBId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_3970d098261d2cb4b1dc2a68d49" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competitions" ADD CONSTRAINT "FK_fd7b2ff668479df63f84352e97b" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_ce457a554d63e92f4627d6c5763" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competition_teams" ADD CONSTRAINT "FK_56f690272a10f500a7811730172" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "competition_teams" ADD CONSTRAINT "FK_98f4fb4f17e452cd23e9eecfd38" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "coach_teams" ADD CONSTRAINT "FK_e7ec949d71e23f5395bfa0b9e58" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "coach_teams" ADD CONSTRAINT "FK_ef7e568d90de1d7586ab38ec0c2" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach_teams" DROP CONSTRAINT "FK_ef7e568d90de1d7586ab38ec0c2"`);
        await queryRunner.query(`ALTER TABLE "coach_teams" DROP CONSTRAINT "FK_e7ec949d71e23f5395bfa0b9e58"`);
        await queryRunner.query(`ALTER TABLE "competition_teams" DROP CONSTRAINT "FK_98f4fb4f17e452cd23e9eecfd38"`);
        await queryRunner.query(`ALTER TABLE "competition_teams" DROP CONSTRAINT "FK_56f690272a10f500a7811730172"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_ce457a554d63e92f4627d6c5763"`);
        await queryRunner.query(`ALTER TABLE "competitions" DROP CONSTRAINT "FK_fd7b2ff668479df63f84352e97b"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_3970d098261d2cb4b1dc2a68d49"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_6dad3cc6e21ab333537eb680d29"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_71e3c30c26d5c72bd77479963eb"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_a47eef6b6df80ec931e288f6350"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_5b332a90bd75f427de98445b5cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef7e568d90de1d7586ab38ec0c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7ec949d71e23f5395bfa0b9e5"`);
        await queryRunner.query(`DROP TABLE "coach_teams"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "coaches"`);
        await queryRunner.query(`DROP TABLE "competitions"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "sport_types"`);
    }

}
