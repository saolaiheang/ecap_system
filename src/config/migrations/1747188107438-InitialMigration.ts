import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747188107438 implements MigrationInterface {
    name = 'InitialMigration1747188107438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" ADD "sport_id" uuid`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_029268ac8618904f13ce1e6cd01" FOREIGN KEY ("sport_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_029268ac8618904f13ce1e6cd01"`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "sport_id"`);
    }

}
