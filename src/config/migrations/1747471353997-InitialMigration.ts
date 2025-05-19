import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747471353997 implements MigrationInterface {
    name = 'InitialMigration1747471353997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL, "year" integer NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "imageUrl" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "history"`);
    }

}
