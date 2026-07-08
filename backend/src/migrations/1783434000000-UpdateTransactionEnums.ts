/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransactionEnums1783434000000 implements MigrationInterface {
  name = 'UpdateTransactionEnums1783434000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."transactions_action_enum" ADD VALUE IF NOT EXISTS 'RECHARGE'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."transactions_itemtype_enum" ADD VALUE IF NOT EXISTS 'CREDITS'`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Enum values cannot be dropped easily in PostgreSQL without recreating the type.
    // Leaving empty to allow rollback of other operations without crashing.
  }
}
