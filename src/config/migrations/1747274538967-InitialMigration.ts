import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747274538967 implements MigrationInterface {
    name = 'InitialMigration1747274538967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'SuperAdmin', 'Public')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Public', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sport_type" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "image" character varying, "description" character varying(1000) NOT NULL, CONSTRAINT "PK_535b2e60d204c943cedec8c9cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(1000) NOT NULL, "date" date NOT NULL, "image" character varying(255), "sport_type_id" uuid NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competition" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "sport_type_id" uuid NOT NULL, "start_date" date NOT NULL, "location" character varying(200) NOT NULL, "image" character varying, CONSTRAINT "PK_a52a6248db574777b226e9445bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stage" ("id" uuid NOT NULL, "name" character varying NOT NULL, "competition_id" uuid NOT NULL, CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("id" uuid NOT NULL, "match_date" date NOT NULL, "location" character varying(255) NOT NULL, "stage_id" uuid NOT NULL, "sport_type_id" uuid NOT NULL, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("id" uuid NOT NULL, "name" character varying(200) NOT NULL, "division" character varying(50) NOT NULL, "contact_info" character varying(300) NOT NULL, "image" character varying, "sport_type_id" uuid, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coach" ("id" uuid NOT NULL, "name" character varying(200) NOT NULL, "contact_info" character varying(200) NOT NULL, "image" character varying, "team_id" uuid, CONSTRAINT "PK_c2ca0875fe0755b197d0147713d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL, "name" character varying(200) NOT NULL, "position" character varying(250) NOT NULL, "team_id" uuid NOT NULL, "sport_id" uuid, "contact_info" character varying(250) NOT NULL, "image" character varying, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match_team" ("match_id" uuid NOT NULL, "team_id" uuid NOT NULL, "team_role" character varying(50) NOT NULL, CONSTRAINT "PK_e46760a9fd37766d5aa3cf94f0d" PRIMARY KEY ("match_id", "team_id"))`);
        await queryRunner.query(`CREATE TABLE "schedule_training" ("id" uuid NOT NULL, "sport_type_id" uuid NOT NULL, "team_id" uuid NOT NULL, "date" date NOT NULL, "time" character varying(200) NOT NULL, "location" character varying(200) NOT NULL, CONSTRAINT "PK_3effe05aee37c079bc0da738b1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match_result" ("id" uuid NOT NULL, "date" date NOT NULL, "match_id" uuid NOT NULL, "teamA_id" uuid NOT NULL, "teamB_id" uuid NOT NULL, "score_team_1" character varying(200) NOT NULL, "score_team_2" character varying(200) NOT NULL, CONSTRAINT "PK_a4450d3f8956bd21c5c916ff273" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_6dbef2fdbf375bc26dfbb382419" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competition" ADD CONSTRAINT "FK_d54bbb887f34a62dd1d9283bc33" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stage" ADD CONSTRAINT "FK_dd08a92149885ed2bd340550c80" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1" FOREIGN KEY ("stage_id") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_aa32fa685d5628fdb0e1f39ec1c" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a0187e96dfe350636f3f406b889" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coach" ADD CONSTRAINT "FK_f1a19958cb90f5ea3879678a204" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_9deb77a11ad43ce17975f13dc85" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_029268ac8618904f13ce1e6cd01" FOREIGN KEY ("sport_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_team" ADD CONSTRAINT "FK_ecac84ca6aa1cca9d76b6a76dd6" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_team" ADD CONSTRAINT "FK_0214c8649a3d8a0a20cb8f7603d" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD CONSTRAINT "FK_52a201f87751b2685025b9d94da" FOREIGN KEY ("sport_type_id") REFERENCES "sport_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_training" ADD CONSTRAINT "FK_0128958f908eee465b13aae6799" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_result" ADD CONSTRAINT "FK_548471fb44c0c72c313c9dc2881" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_result" ADD CONSTRAINT "FK_75890fcfcfcdc30b2545078bf82" FOREIGN KEY ("teamA_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_result" ADD CONSTRAINT "FK_889415c9abf249e87b73dc4afc9" FOREIGN KEY ("teamB_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_result" DROP CONSTRAINT "FK_889415c9abf249e87b73dc4afc9"`);
        await queryRunner.query(`ALTER TABLE "match_result" DROP CONSTRAINT "FK_75890fcfcfcdc30b2545078bf82"`);
        await queryRunner.query(`ALTER TABLE "match_result" DROP CONSTRAINT "FK_548471fb44c0c72c313c9dc2881"`);
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP CONSTRAINT "FK_0128958f908eee465b13aae6799"`);
        await queryRunner.query(`ALTER TABLE "schedule_training" DROP CONSTRAINT "FK_52a201f87751b2685025b9d94da"`);
        await queryRunner.query(`ALTER TABLE "match_team" DROP CONSTRAINT "FK_0214c8649a3d8a0a20cb8f7603d"`);
        await queryRunner.query(`ALTER TABLE "match_team" DROP CONSTRAINT "FK_ecac84ca6aa1cca9d76b6a76dd6"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_029268ac8618904f13ce1e6cd01"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_9deb77a11ad43ce17975f13dc85"`);
        await queryRunner.query(`ALTER TABLE "coach" DROP CONSTRAINT "FK_f1a19958cb90f5ea3879678a204"`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a0187e96dfe350636f3f406b889"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_aa32fa685d5628fdb0e1f39ec1c"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_873d0b9da9a0f032d00fbfb89c1"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP CONSTRAINT "FK_dd08a92149885ed2bd340550c80"`);
        await queryRunner.query(`ALTER TABLE "competition" DROP CONSTRAINT "FK_d54bbb887f34a62dd1d9283bc33"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_6dbef2fdbf375bc26dfbb382419"`);
        await queryRunner.query(`DROP TABLE "match_result"`);
        await queryRunner.query(`DROP TABLE "schedule_training"`);
        await queryRunner.query(`DROP TABLE "match_team"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "coach"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "stage"`);
        await queryRunner.query(`DROP TABLE "competition"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "sport_type"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
