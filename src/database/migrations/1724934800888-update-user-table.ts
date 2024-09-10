import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1724934800888 implements MigrationInterface {
    name = 'UpdateUserTable1724934800888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`description\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`gender\` enum ('1', '2') NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`description\``);
    }

}
