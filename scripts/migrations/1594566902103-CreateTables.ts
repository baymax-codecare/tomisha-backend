import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1594566902103 implements MigrationInterface {
    name = 'CreateTables1594566902103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "type" smallint NOT NULL DEFAULT 1, "slug" character varying NOT NULL, "verified" boolean DEFAULT false, "status" smallint NOT NULL DEFAULT 1, "gender" smallint, "civilStatus" smallint, "firstName" character varying, "lastName" character varying, "phone" character varying, "dob" date, "cover" character varying, "coutry" character varying, "city" character varying, "street" character varying, "address" character varying(500), "postcode" character varying, "nationality" character varying, "pob" character varying, "residentPermit" character varying, "driveLicense" character varying, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bc0c27d77ee64f0a097a5c269b" ON "users" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_3676155292d72c67cd4e090514"`);
        await queryRunner.query(`DROP INDEX "IDX_bc0c27d77ee64f0a097a5c269b"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
