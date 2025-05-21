import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747814529118 implements MigrationInterface {
    name = 'InitialMigration1747814529118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."match_friendly_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "match_friendly" ("id" uuid NOT NULL, "match_date" date NOT NULL, "match_time" TIME NOT NULL, "location" character varying(255) NOT NULL, "status" "public"."match_friendly_status_enum" NOT NULL DEFAULT 'scheduled', "teamA_id" uuid NOT NULL, "teamB_id" uuid NOT NULL, "teamA_score" integer, "teamB_score" integer, "sport_type_id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b535edd6e108a18f7d76d40591d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match_friendly" ADD CONSTRAINT "FK_288bb514fd64c9b41db59edba0e" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_friendly" ADD CONSTRAINT "FK_2ec4c80c44391b287c808e2c3d7" FOREIGN KEY ("teamA_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_friendly" ADD CONSTRAINT "FK_c558f4ab31d099b499591f96a2e" FOREIGN KEY ("teamB_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_friendly" DROP CONSTRAINT "FK_c558f4ab31d099b499591f96a2e"`);
        await queryRunner.query(`ALTER TABLE "match_friendly" DROP CONSTRAINT "FK_2ec4c80c44391b287c808e2c3d7"`);
        await queryRunner.query(`ALTER TABLE "match_friendly" DROP CONSTRAINT "FK_288bb514fd64c9b41db59edba0e"`);
        await queryRunner.query(`DROP TABLE "match_friendly"`);
        await queryRunner.query(`DROP TYPE "public"."match_friendly_status_enum"`);
    }

}
