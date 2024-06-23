import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostLike1717861255506 implements MigrationInterface {
    name = 'AddPostLike1717861255506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post_like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NULL, \`updatedAt\` datetime NULL, \`deletedAt\` datetime NULL, \`userId\` int NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post_like\` ADD CONSTRAINT \`FK_909fc474ef645901d01f0cc0662\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_like\` ADD CONSTRAINT \`FK_789b3f929eb3d8760419f87c8a9\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_like\` DROP FOREIGN KEY \`FK_789b3f929eb3d8760419f87c8a9\``);
        await queryRunner.query(`ALTER TABLE \`post_like\` DROP FOREIGN KEY \`FK_909fc474ef645901d01f0cc0662\``);
        await queryRunner.query(`DROP TABLE \`post_like\``);
    }

}
