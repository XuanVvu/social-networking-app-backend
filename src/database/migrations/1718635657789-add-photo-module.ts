import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoModule1718635657789 implements MigrationInterface {
    name = 'AddPhotoModule1718635657789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`filename\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`isPublished\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`views\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_26a50e5f89820e2ffbacc70ee5c\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_26a50e5f89820e2ffbacc70ee5c\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`url\``);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`views\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`name\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`isPublished\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`filename\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`description\` text NOT NULL`);
    }

}
