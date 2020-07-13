import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserField1594597018708 implements MigrationInterface {
    name = 'AddUserField1594597018708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "picture" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "picture"`);
    }

}
