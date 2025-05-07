import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746517512639 implements MigrationInterface {
    name = 'InitialMigration1746517512639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matches" ("id" character varying NOT NULL, "teamA" character varying NOT NULL, "teamB" character varying NOT NULL, "date_match" character varying NOT NULL, "time_match" character varying NOT NULL, "typeOfSportId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_10c264ce8b7117ca5eb71d9ea32" FOREIGN KEY ("typeOfSportId") REFERENCES "type_of_sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_10c264ce8b7117ca5eb71d9ea32"`);
        await queryRunner.query(`DROP TABLE "matches"`);
    }

}
