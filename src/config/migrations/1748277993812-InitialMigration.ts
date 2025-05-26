import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748277993812 implements MigrationInterface {
    name = 'InitialMigration1748277993812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "video" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "video" DROP NOT NULL`);
    }

}
