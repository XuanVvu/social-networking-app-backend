import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFriend1723738095351 implements MigrationInterface {
    name = 'AddFriend1723738095351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`userId\` \`authorId\` int NULL`);
        await queryRunner.query(`CREATE TABLE \`shared_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NULL, \`updatedAt\` datetime NULL, \`deletedAt\` datetime NULL, \`caption\` varchar(255) NULL, \`sharedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`sharedById\` int NULL, \`originalPostId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friend\` ADD \`createdAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`friend\` ADD \`updatedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`friend\` ADD \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`shared_post\` ADD CONSTRAINT \`FK_6b6cc170ea70a57d7636ef9c392\` FOREIGN KEY (\`sharedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shared_post\` ADD CONSTRAINT \`FK_e4f6ed793afd9f6c759c016d37c\` FOREIGN KEY (\`originalPostId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`shared_post\` DROP FOREIGN KEY \`FK_e4f6ed793afd9f6c759c016d37c\``);
        await queryRunner.query(`ALTER TABLE \`shared_post\` DROP FOREIGN KEY \`FK_6b6cc170ea70a57d7636ef9c392\``);
        await queryRunner.query(`ALTER TABLE \`friend\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`friend\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`friend\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`DROP TABLE \`shared_post\``);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`authorId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
