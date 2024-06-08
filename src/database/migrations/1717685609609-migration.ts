import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717685609609 implements MigrationInterface {
    name = 'Migration1717685609609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`estimateSellingPrice1\` \`purchasePrice\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`purchasePrice\` \`estimateSellingPrice1\` int NOT NULL`);
    }

}
