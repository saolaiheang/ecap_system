import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747355338128 implements MigrationInterface {
    name = 'InitialMigration1747355338128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach" ADD "sport_id" uuid`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_68ac884f01f7af4af1edb4f1ff9" FOREIGN KEY ("sport_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_68ac884f01f7af4af1edb4f1ff9"`);
        await queryRunner.query(`ALTER TABLE "coach" DROP COLUMN "sport_id"`);
    }

}
