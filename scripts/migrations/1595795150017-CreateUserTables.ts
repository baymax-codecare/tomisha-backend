import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTables1595795150017 implements MigrationInterface {
    name = 'CreateUserTables1595795150017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-experiences" ("userId" uuid, "fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" smallint, "professionId" smallint, "progress" smallint, "level" smallint, CONSTRAINT "PK_3577c343d30ba4ceb124f6e0f40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-skills" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "skillId" smallint NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_b5bd8f22bbe6cc2c914b8db903b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-languages" ("userId" uuid, "fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lang" character varying(50), "title" character varying(250), "level" smallint, CONSTRAINT "PK_0bcae0129edeb631686278c86d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-schools" ("userId" uuid, "fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(250), CONSTRAINT "PK_51242c12bb444398fa70e899693" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-trainings" ("userId" uuid, "fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(250), "type" smallint, CONSTRAINT "PK_930b13f8884971b7ca8ae410759" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-files" ("userId" uuid, "fileName" character varying(250), "fileUrl" character varying(250), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_8977db56817d7060327649df789" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying(50), "country" character varying(3), "street" character varying(250), "city" character varying(250), "postCode" character varying(50), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "type" smallint, "slug" character varying NOT NULL, "progress" smallint NOT NULL DEFAULT 0, "status" smallint NOT NULL DEFAULT 1, "gender" smallint, "maritalStatus" smallint, "firstName" character varying(250), "lastName" character varying(250), "cover" character varying(250), "picture" character varying(250), "dob" date, "nationality" character varying(3), "pob" character varying(500), "hobbies" smallint array, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bc0c27d77ee64f0a097a5c269b" ON "users" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
        await queryRunner.query(`CREATE TABLE "user-documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "group" smallint, "type" smallint, "url" character varying(250), CONSTRAINT "PK_36f76469066a56e4f4d53596a7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_references_users" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_b826701bfe186ec6f2b1e31c7c2" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ccdb5d04fc8f0a9edd48653536" ON "users_references_users" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_1bf6f33550debfb188de5c27c1" ON "users_references_users" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "user-experiences" ADD CONSTRAINT "FK_7437a911c48afd9703149a94b1d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-skills" ADD CONSTRAINT "FK_5cbce4993df9959eaedb7d08de6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-languages" ADD CONSTRAINT "FK_869a91c06d70b3a86cea2e95f60" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-schools" ADD CONSTRAINT "FK_c5e71174e15048d01e273e3b1fe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-trainings" ADD CONSTRAINT "FK_1b49c37993835230814c4ebc5f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-files" ADD CONSTRAINT "FK_8baf6a8ede8bd020f135a4272b2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-documents" ADD CONSTRAINT "FK_7f99ec00f58f7a1e79c9cb3cd47" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_references_users" ADD CONSTRAINT "FK_ccdb5d04fc8f0a9edd48653536c" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_references_users" ADD CONSTRAINT "FK_1bf6f33550debfb188de5c27c16" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_references_users" DROP CONSTRAINT "FK_1bf6f33550debfb188de5c27c16"`);
        await queryRunner.query(`ALTER TABLE "users_references_users" DROP CONSTRAINT "FK_ccdb5d04fc8f0a9edd48653536c"`);
        await queryRunner.query(`ALTER TABLE "user-documents" DROP CONSTRAINT "FK_7f99ec00f58f7a1e79c9cb3cd47"`);
        await queryRunner.query(`ALTER TABLE "user-files" DROP CONSTRAINT "FK_8baf6a8ede8bd020f135a4272b2"`);
        await queryRunner.query(`ALTER TABLE "user-trainings" DROP CONSTRAINT "FK_1b49c37993835230814c4ebc5f4"`);
        await queryRunner.query(`ALTER TABLE "user-schools" DROP CONSTRAINT "FK_c5e71174e15048d01e273e3b1fe"`);
        await queryRunner.query(`ALTER TABLE "user-languages" DROP CONSTRAINT "FK_869a91c06d70b3a86cea2e95f60"`);
        await queryRunner.query(`ALTER TABLE "user-skills" DROP CONSTRAINT "FK_5cbce4993df9959eaedb7d08de6"`);
        await queryRunner.query(`ALTER TABLE "user-experiences" DROP CONSTRAINT "FK_7437a911c48afd9703149a94b1d"`);
        await queryRunner.query(`DROP INDEX "IDX_1bf6f33550debfb188de5c27c1"`);
        await queryRunner.query(`DROP INDEX "IDX_ccdb5d04fc8f0a9edd48653536"`);
        await queryRunner.query(`DROP TABLE "users_references_users"`);
        await queryRunner.query(`DROP TABLE "user-documents"`);
        await queryRunner.query(`DROP INDEX "IDX_3676155292d72c67cd4e090514"`);
        await queryRunner.query(`DROP INDEX "IDX_bc0c27d77ee64f0a097a5c269b"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user-files"`);
        await queryRunner.query(`DROP TABLE "user-trainings"`);
        await queryRunner.query(`DROP TABLE "user-schools"`);
        await queryRunner.query(`DROP TABLE "user-languages"`);
        await queryRunner.query(`DROP TABLE "user-skills"`);
        await queryRunner.query(`DROP TABLE "user-experiences"`);
    }

}
