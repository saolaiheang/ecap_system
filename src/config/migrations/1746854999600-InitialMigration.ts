import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1746854999600 implements MigrationInterface {
    name = 'InitialMigration1746854999600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a0187e96dfe350636f3f406b889"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "sport_type_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a0187e96dfe350636f3f406b889" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a0187e96dfe350636f3f406b889"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "sport_type_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a0187e96dfe350636f3f406b889" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
