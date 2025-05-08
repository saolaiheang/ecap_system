import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746674623261 implements MigrationInterface {
    name = 'InitialMigration1746674623261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport_types" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_293068ddae699e551f76783559e" UNIQUE ("name"), CONSTRAINT "PK_ac71fc905daf915674ac2652898" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competitions" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lacation" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "type_of_sport_id" uuid, CONSTRAINT "PK_ef273910798c3a542b475e75c7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competition_teams" ("competition_id" character varying NOT NULL, "team_id" uuid NOT NULL, CONSTRAINT "PK_eb3390d51aa9d9bf91a9a535357" PRIMARY KEY ("competition_id", "team_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56f690272a10f500a781173017" ON "competition_teams" ("competition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_98f4fb4f17e452cd23e9eecfd3" ON "competition_teams" ("team_id") `);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_5b332a90bd75f427de98445b5cb" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_a47eef6b6df80ec931e288f6350" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_3970d098261d2cb4b1dc2a68d49" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competitions" ADD CONSTRAINT "FK_fd7b2ff668479df63f84352e97b" FOREIGN KEY ("type_of_sport_id") REFERENCES "sport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competition_teams" ADD CONSTRAINT "FK_56f690272a10f500a7811730172" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "competition_teams" ADD CONSTRAINT "FK_98f4fb4f17e452cd23e9eecfd38" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competition_teams" DROP CONSTRAINT "FK_98f4fb4f17e452cd23e9eecfd38"`);
        await queryRunner.query(`ALTER TABLE "competition_teams" DROP CONSTRAINT "FK_56f690272a10f500a7811730172"`);
        await queryRunner.query(`ALTER TABLE "competitions" DROP CONSTRAINT "FK_fd7b2ff668479df63f84352e97b"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_3970d098261d2cb4b1dc2a68d49"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_a47eef6b6df80ec931e288f6350"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_5b332a90bd75f427de98445b5cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98f4fb4f17e452cd23e9eecfd3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56f690272a10f500a781173017"`);
        await queryRunner.query(`DROP TABLE "competition_teams"`);
        await queryRunner.query(`DROP TABLE "competitions"`);
        await queryRunner.query(`DROP TABLE "sport_types"`);
    }

}
