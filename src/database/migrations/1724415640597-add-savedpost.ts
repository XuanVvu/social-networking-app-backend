import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSavedpost1724415640597 implements MigrationInterface {
    name = 'AddSavedpost1724415640597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`saved_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NULL, \`updatedAt\` datetime NULL, \`deletedAt\` datetime NULL, \`savedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`saved_post\` ADD CONSTRAINT \`FK_9e99affc0bf212c06c0fd53530f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`saved_post\` ADD CONSTRAINT \`FK_e63ab07f9725788aaca1ae059f8\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_post\` DROP FOREIGN KEY \`FK_e63ab07f9725788aaca1ae059f8\``);
        await queryRunner.query(`ALTER TABLE \`saved_post\` DROP FOREIGN KEY \`FK_9e99affc0bf212c06c0fd53530f\``);
        await queryRunner.query(`DROP TABLE \`saved_post\``);
    }

}
