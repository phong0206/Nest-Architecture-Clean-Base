import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAccessTokenTableUserAdmin1726471961880 implements MigrationInterface {
    name = 'AddColumnAccessTokenTableUserAdmin1726471961880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`access_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` ADD \`access_token\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`access_token\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`access_token\``);
    }

}
