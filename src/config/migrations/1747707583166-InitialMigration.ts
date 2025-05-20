import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747707583166 implements MigrationInterface {
    name = 'InitialMigration1747707583166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "match_time" TIME NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "match_time"`);
    }

}
