import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserDocument1598010827058 implements MigrationInterface {
    name = 'UpdateUserDocument1598010827058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-documents" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user-documents" ADD "issuedAt" date`);
        await queryRunner.query(`ALTER TABLE "user-documents" ADD CONSTRAINT "FK_4417fcf6191c6c017bdd99379e1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-documents" DROP CONSTRAINT "FK_4417fcf6191c6c017bdd99379e1"`);
        await queryRunner.query(`ALTER TABLE "user-documents" DROP COLUMN "issuedAt"`);
        await queryRunner.query(`ALTER TABLE "user-documents" DROP COLUMN "companyId"`);
    }

}
