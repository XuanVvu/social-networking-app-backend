import { MigrationInterface, QueryRunner } from "typeorm";

export class AdđPostComment1717821746241 implements MigrationInterface {
    name = 'AdđPostComment1717821746241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`test\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`test\``);
    }

}
