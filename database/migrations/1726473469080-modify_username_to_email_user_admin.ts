import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUsernameToEmailUserAdmin1726473469080 implements MigrationInterface {
    name = 'ModifyUsernameToEmailUserAdmin1726473469080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`username\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`admins\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`admins\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`email\` \`username\` varchar(255) NOT NULL`);
    }

}
