import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747475351704 implements MigrationInterface {
    name = 'InitialMigration1747475351704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "history" ADD "year" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "history" ADD "year" integer NOT NULL`);
    }

}
