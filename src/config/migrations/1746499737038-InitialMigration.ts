import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746499737038 implements MigrationInterface {
    name = 'InitialMigration1746499737038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news" ("id" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type_of_sport_id" uuid, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_5b332a90bd75f427de98445b5cb" FOREIGN KEY ("type_of_sport_id") REFERENCES "type_of_sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_5b332a90bd75f427de98445b5cb"`);
        await queryRunner.query(`DROP TABLE "news"`);
    }

}
