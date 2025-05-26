import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748221042140 implements MigrationInterface {
    name = 'InitialMigration1748221042140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(300) NOT NULL, "video" character varying(255), "create_at" TIMESTAMP NOT NULL DEFAULT now(), "sport_id" uuid, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_473176a931d8572ff98c28bb025" FOREIGN KEY ("sport_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_473176a931d8572ff98c28bb025"`);
        await queryRunner.query(`DROP TABLE "activities"`);
    }

}
