import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746429131808 implements MigrationInterface {
    name = 'InitialMigration1746429131808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "type_of_sport" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" text, CONSTRAINT "UQ_1599f671c6abfb86db3212b1562" UNIQUE ("name"), CONSTRAINT "PK_b30e8ebc5976e9f017c233553df" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "type_of_sport"`);
    }

}
