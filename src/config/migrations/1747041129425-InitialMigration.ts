import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747041129425 implements MigrationInterface {
    name = 'InitialMigration1747041129425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sport_type" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "competition" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "team" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "coach" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "player" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "competition" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "sport_type" DROP COLUMN "image"`);
    }

}
