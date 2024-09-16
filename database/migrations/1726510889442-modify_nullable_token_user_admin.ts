import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyNullableTokenUserAdmin1726510889442 implements MigrationInterface {
    name = 'ModifyNullableTokenUserAdmin1726510889442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`access_token\` \`access_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`access_token\` \`access_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`access_token\` \`access_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`admins\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`access_token\` \`access_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
