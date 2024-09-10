import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSavedPost1725351500874 implements MigrationInterface {
    name = 'UpdateSavedPost1725351500874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_post\` DROP FOREIGN KEY \`FK_e63ab07f9725788aaca1ae059f8\``);
        await queryRunner.query(`ALTER TABLE \`saved_post\` ADD CONSTRAINT \`FK_e63ab07f9725788aaca1ae059f8\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`saved_post\` DROP FOREIGN KEY \`FK_e63ab07f9725788aaca1ae059f8\``);
        await queryRunner.query(`ALTER TABLE \`saved_post\` ADD CONSTRAINT \`FK_e63ab07f9725788aaca1ae059f8\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
