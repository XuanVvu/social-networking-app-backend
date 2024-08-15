import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFriend1723560130451 implements MigrationInterface {
    name = 'AddFriend1723560130451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friend\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`requesterId\` int NULL, \`recipientId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friend\` ADD CONSTRAINT \`FK_77431e45d96b9c20941edf49df2\` FOREIGN KEY (\`requesterId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend\` ADD CONSTRAINT \`FK_045ee368c826f94f6675ba4e41d\` FOREIGN KEY (\`recipientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`friend\` DROP FOREIGN KEY \`FK_045ee368c826f94f6675ba4e41d\``);
        await queryRunner.query(`ALTER TABLE \`friend\` DROP FOREIGN KEY \`FK_77431e45d96b9c20941edf49df2\``);
        await queryRunner.query(`DROP TABLE \`friend\``);
    }

}
