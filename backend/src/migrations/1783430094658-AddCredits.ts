import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCredits1783430094658 implements MigrationInterface {
  name = 'AddCredits1783430094658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "credits" integer NOT NULL DEFAULT '3000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "credits"`);
  }
}
