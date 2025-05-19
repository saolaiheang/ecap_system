import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747623212981 implements MigrationInterface {
    name = 'InitialMigration1747623212981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1"`);
        await queryRunner.query(`CREATE TYPE "public"."stage_type_enum" AS ENUM('group', 'semifinal', 'final')`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "type" "public"."stage_type_enum" NOT NULL DEFAULT 'group'`);
        await queryRunner.query(`CREATE TYPE "public"."match_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "match" ADD "status" "public"."match_status_enum" NOT NULL DEFAULT 'scheduled'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "teamA_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "teamB_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "teamA_score" integer`);
        await queryRunner.query(`ALTER TABLE "match" ADD "teamB_score" integer`);
        await queryRunner.query(`ALTER TABLE "match" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stage" ADD CONSTRAINT "UQ_cbeb0a0f411c8b0879565811d01" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1" FOREIGN KEY ("stage_id") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_f7e2ec53775718aed3a90b6f90f" FOREIGN KEY ("teamA_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_9cfe4f72800cac5b163e3546f4f" FOREIGN KEY ("teamB_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_9cfe4f72800cac5b163e3546f4f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_f7e2ec53775718aed3a90b6f90f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP CONSTRAINT "UQ_cbeb0a0f411c8b0879565811d01"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "teamB_score"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "teamA_score"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "teamB_id"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "teamA_id"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."match_status_enum"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."stage_type_enum"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1" FOREIGN KEY ("stage_id") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
