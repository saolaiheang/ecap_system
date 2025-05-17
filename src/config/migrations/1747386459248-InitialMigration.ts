import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747386459248 implements MigrationInterface {
    name = 'InitialMigration1747386459248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD "coach_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD CONSTRAINT "FK_07a44b54a993bf108776282d19c" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP CONSTRAINT "FK_07a44b54a993bf108776282d19c"`);
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP COLUMN "coach_id"`);
    }

}
