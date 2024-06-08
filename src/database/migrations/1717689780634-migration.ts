import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717689780634 implements MigrationInterface {
    name = 'Migration1717689780634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_categories_category\` (\`questionId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_21433e6d9a0e7e79c36b4ae69f\` (\`questionId\`), INDEX \`IDX_9cf04f10454634f887ade56562\` (\`categoryId\`), PRIMARY KEY (\`questionId\`, \`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question_categories_category\` ADD CONSTRAINT \`FK_21433e6d9a0e7e79c36b4ae69fd\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`question_categories_category\` ADD CONSTRAINT \`FK_9cf04f10454634f887ade565622\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_categories_category\` DROP FOREIGN KEY \`FK_9cf04f10454634f887ade565622\``);
        await queryRunner.query(`ALTER TABLE \`question_categories_category\` DROP FOREIGN KEY \`FK_21433e6d9a0e7e79c36b4ae69fd\``);
        await queryRunner.query(`DROP INDEX \`IDX_9cf04f10454634f887ade56562\` ON \`question_categories_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_21433e6d9a0e7e79c36b4ae69f\` ON \`question_categories_category\``);
        await queryRunner.query(`DROP TABLE \`question_categories_category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`question\``);
    }

}
