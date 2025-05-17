import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747386816995 implements MigrationInterface {
    name = 'InitialMigration1747386816995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD "date" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD "date" date NOT NULL`);
    }

}
