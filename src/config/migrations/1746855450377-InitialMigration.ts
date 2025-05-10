import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746855450377 implements MigrationInterface {
    name = 'InitialMigration1746855450377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_f1a19958cb90f5ea3879678a204"`);
        await queryRunner.query(`ALTER TABLE "coach" ALTER COLUMN "team_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_f1a19958cb90f5ea3879678a204" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_f1a19958cb90f5ea3879678a204"`);
        await queryRunner.query(`ALTER TABLE "coach" ALTER COLUMN "team_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_f1a19958cb90f5ea3879678a204" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
