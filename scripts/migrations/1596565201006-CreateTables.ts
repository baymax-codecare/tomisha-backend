import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1596565201006 implements MigrationInterface {
    name = 'CreateTables1596565201006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "group" smallint, "type" smallint, "front" character varying(250), "back" character varying(250), CONSTRAINT "PK_36f76469066a56e4f4d53596a7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-experiences" ("fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "userId" uuid, "companyId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" smallint, "professionId" smallint, "workload" smallint, "level" smallint, CONSTRAINT "PK_3577c343d30ba4ceb124f6e0f40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "skillId" smallint NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_b5bd8f22bbe6cc2c914b8db903b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-languages" ("fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "userId" uuid, "companyId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lang" character varying(50), "title" character varying(250), "level" smallint, CONSTRAINT "PK_0bcae0129edeb631686278c86d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-schools" ("fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "userId" uuid, "companyId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(250), CONSTRAINT "PK_51242c12bb444398fa70e899693" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-trainings" ("fileName" character varying(250), "fileUrl" character varying(250), "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "userId" uuid, "companyId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(250), "type" smallint, CONSTRAINT "PK_930b13f8884971b7ca8ae410759" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-files" ("fileName" character varying(250), "fileUrl" character varying(250), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_8977db56817d7060327649df789" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying(50), "country" character varying(3), "street" character varying(250), "city" character varying(250), "zip" character varying(50), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "type" smallint, "slug" character varying NOT NULL, "progress" smallint NOT NULL DEFAULT 0, "status" smallint NOT NULL DEFAULT 1, "gender" smallint, "maritalStatus" smallint, "firstName" character varying(250), "lastName" character varying(250), "cover" character varying(250), "picture" character varying(250), "dob" date, "nationality" character varying(3), "pob" character varying(500), "hobbies" smallint array, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bc0c27d77ee64f0a097a5c269b" ON "users" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
        await queryRunner.query(`CREATE TABLE "company-users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyId" uuid, "userId" uuid, "rights" smallint array, CONSTRAINT "PK_002fcf377d725e1b162c4d4992a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb34a611c290a1c9f9784ca554" ON "company-users" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_742fbb7f78491ff53600899f82" ON "company-users" ("userId") `);
        await queryRunner.query(`CREATE TABLE "companies" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "emailExpireAt" TIME, "slug" character varying NOT NULL, "status" smallint NOT NULL DEFAULT 1, "name" character varying(500), "cover" character varying(250), "picture" character varying(250), "slogan" character varying, "description" character varying, "website" character varying, "foundedAt" date, "size" integer, "totalPermanents" integer, "totalInterns" integer, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d0af6f5866201d5cb424767744" ON "companies" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_00a6b1d98d87a3eb9692f92de0" ON "companies" ("emailExpireAt") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b28b07d25e4324eee577de5496" ON "companies" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_fa5b148ef2ac03342ed8d9078b" ON "companies" ("status") `);
        await queryRunner.query(`CREATE TABLE "company-locations" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying(50), "country" character varying(3), "street" character varying(250), "city" character varying(250), "zip" character varying(50), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(500), "companyId" uuid, CONSTRAINT "PK_c479fa8d07ad4895e2bc5446b66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "occupation-preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "occupationId" uuid NOT NULL, "preferenceId" smallint NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_b0481682c02791e52c5471afb9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "occupation-skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "occupationId" uuid NOT NULL, "skillId" smallint NOT NULL, "level" smallint NOT NULL, "userId" uuid, CONSTRAINT "PK_d86f62a03657c881bffa396eca7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "occupations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "professionId" uuid NOT NULL, "minWorkload" smallint NOT NULL DEFAULT 0, "maxWorkload" smallint NOT NULL DEFAULT 100, "relationships" smallint array, "specialSkill" character varying(250), "skillDescription" character varying, "characteristic" character varying, CONSTRAINT "PK_0bf09083dd897df1e8ebb96b5c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "occupation-experiences" ("fileName" character varying(250), "fileUrl" character varying(250), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" smallint, "professionId" smallint, "workload" smallint, "level" smallint, "start" date NOT NULL, "end" date NOT NULL, "description" character varying, "companyId" uuid, "occupationId" uuid NOT NULL, CONSTRAINT "PK_64b1d2e620e67290050ad681fcd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_references_users" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_b826701bfe186ec6f2b1e31c7c2" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ccdb5d04fc8f0a9edd48653536" ON "users_references_users" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_1bf6f33550debfb188de5c27c1" ON "users_references_users" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "user-documents" ADD CONSTRAINT "FK_7f99ec00f58f7a1e79c9cb3cd47" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-experiences" ADD CONSTRAINT "FK_7437a911c48afd9703149a94b1d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-experiences" ADD CONSTRAINT "FK_439eff00a73295e8936ccd30e73" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-skills" ADD CONSTRAINT "FK_5cbce4993df9959eaedb7d08de6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-languages" ADD CONSTRAINT "FK_869a91c06d70b3a86cea2e95f60" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-languages" ADD CONSTRAINT "FK_a0d8003a34e09bf07c8c60376bd" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-schools" ADD CONSTRAINT "FK_c5e71174e15048d01e273e3b1fe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-schools" ADD CONSTRAINT "FK_0a6004cef1accdfd8e3c05cd1e9" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-trainings" ADD CONSTRAINT "FK_1b49c37993835230814c4ebc5f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-trainings" ADD CONSTRAINT "FK_e04713b46665eb232bc5762088d" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-files" ADD CONSTRAINT "FK_8baf6a8ede8bd020f135a4272b2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company-users" ADD CONSTRAINT "FK_eb34a611c290a1c9f9784ca554a" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company-users" ADD CONSTRAINT "FK_742fbb7f78491ff53600899f826" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company-locations" ADD CONSTRAINT "FK_e7806ba3eb2795bf508112a7e91" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occupation-preferences" ADD CONSTRAINT "FK_306e9e913d5d804ca8b34ef30d4" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occupation-skills" ADD CONSTRAINT "FK_f29b4adb37c4129c52ee6eec9a4" FOREIGN KEY ("userId") REFERENCES "occupations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occupations" ADD CONSTRAINT "FK_3b1319c72da52696b09a19e4558" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occupation-experiences" ADD CONSTRAINT "FK_69d8f31a61665e00e5ec414b3b9" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "occupation-experiences" ADD CONSTRAINT "FK_f0d8a4d53bc310dd4d7a05c8a2c" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_references_users" ADD CONSTRAINT "FK_ccdb5d04fc8f0a9edd48653536c" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_references_users" ADD CONSTRAINT "FK_1bf6f33550debfb188de5c27c16" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_references_users" DROP CONSTRAINT "FK_1bf6f33550debfb188de5c27c16"`);
        await queryRunner.query(`ALTER TABLE "users_references_users" DROP CONSTRAINT "FK_ccdb5d04fc8f0a9edd48653536c"`);
        await queryRunner.query(`ALTER TABLE "occupation-experiences" DROP CONSTRAINT "FK_f0d8a4d53bc310dd4d7a05c8a2c"`);
        await queryRunner.query(`ALTER TABLE "occupation-experiences" DROP CONSTRAINT "FK_69d8f31a61665e00e5ec414b3b9"`);
        await queryRunner.query(`ALTER TABLE "occupations" DROP CONSTRAINT "FK_3b1319c72da52696b09a19e4558"`);
        await queryRunner.query(`ALTER TABLE "occupation-skills" DROP CONSTRAINT "FK_f29b4adb37c4129c52ee6eec9a4"`);
        await queryRunner.query(`ALTER TABLE "occupation-preferences" DROP CONSTRAINT "FK_306e9e913d5d804ca8b34ef30d4"`);
        await queryRunner.query(`ALTER TABLE "company-locations" DROP CONSTRAINT "FK_e7806ba3eb2795bf508112a7e91"`);
        await queryRunner.query(`ALTER TABLE "company-users" DROP CONSTRAINT "FK_742fbb7f78491ff53600899f826"`);
        await queryRunner.query(`ALTER TABLE "company-users" DROP CONSTRAINT "FK_eb34a611c290a1c9f9784ca554a"`);
        await queryRunner.query(`ALTER TABLE "user-files" DROP CONSTRAINT "FK_8baf6a8ede8bd020f135a4272b2"`);
        await queryRunner.query(`ALTER TABLE "user-trainings" DROP CONSTRAINT "FK_e04713b46665eb232bc5762088d"`);
        await queryRunner.query(`ALTER TABLE "user-trainings" DROP CONSTRAINT "FK_1b49c37993835230814c4ebc5f4"`);
        await queryRunner.query(`ALTER TABLE "user-schools" DROP CONSTRAINT "FK_0a6004cef1accdfd8e3c05cd1e9"`);
        await queryRunner.query(`ALTER TABLE "user-schools" DROP CONSTRAINT "FK_c5e71174e15048d01e273e3b1fe"`);
        await queryRunner.query(`ALTER TABLE "user-languages" DROP CONSTRAINT "FK_a0d8003a34e09bf07c8c60376bd"`);
        await queryRunner.query(`ALTER TABLE "user-languages" DROP CONSTRAINT "FK_869a91c06d70b3a86cea2e95f60"`);
        await queryRunner.query(`ALTER TABLE "user-skills" DROP CONSTRAINT "FK_5cbce4993df9959eaedb7d08de6"`);
        await queryRunner.query(`ALTER TABLE "user-experiences" DROP CONSTRAINT "FK_439eff00a73295e8936ccd30e73"`);
        await queryRunner.query(`ALTER TABLE "user-experiences" DROP CONSTRAINT "FK_7437a911c48afd9703149a94b1d"`);
        await queryRunner.query(`ALTER TABLE "user-documents" DROP CONSTRAINT "FK_7f99ec00f58f7a1e79c9cb3cd47"`);
        await queryRunner.query(`DROP INDEX "IDX_1bf6f33550debfb188de5c27c1"`);
        await queryRunner.query(`DROP INDEX "IDX_ccdb5d04fc8f0a9edd48653536"`);
        await queryRunner.query(`DROP TABLE "users_references_users"`);
        await queryRunner.query(`DROP TABLE "occupation-experiences"`);
        await queryRunner.query(`DROP TABLE "occupations"`);
        await queryRunner.query(`DROP TABLE "occupation-skills"`);
        await queryRunner.query(`DROP TABLE "occupation-preferences"`);
        await queryRunner.query(`DROP TABLE "company-locations"`);
        await queryRunner.query(`DROP INDEX "IDX_fa5b148ef2ac03342ed8d9078b"`);
        await queryRunner.query(`DROP INDEX "IDX_b28b07d25e4324eee577de5496"`);
        await queryRunner.query(`DROP INDEX "IDX_00a6b1d98d87a3eb9692f92de0"`);
        await queryRunner.query(`DROP INDEX "IDX_d0af6f5866201d5cb424767744"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP INDEX "IDX_742fbb7f78491ff53600899f82"`);
        await queryRunner.query(`DROP INDEX "IDX_eb34a611c290a1c9f9784ca554"`);
        await queryRunner.query(`DROP TABLE "company-users"`);
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
        await queryRunner.query(`DROP TABLE "user-documents"`);
    }

}
