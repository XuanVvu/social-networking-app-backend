import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatNotification1723966619332 implements MigrationInterface {
    name = 'AddChatNotification1723966619332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NULL, \`updatedAt\` datetime NULL, \`deletedAt\` datetime NULL, \`type\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`relatedItemId\` int NULL, \`recipientId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime NULL, \`updatedAt\` datetime NULL, \`deletedAt\` datetime NULL, \`senderId\` int NOT NULL, \`receiverId\` int NOT NULL, \`content\` text NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isRead\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_ab7cbe7a013ecac5da0a8f88884\` FOREIGN KEY (\`recipientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_ab7cbe7a013ecac5da0a8f88884\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
