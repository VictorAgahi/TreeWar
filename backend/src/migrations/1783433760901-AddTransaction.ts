import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransaction1783433760901 implements MigrationInterface {
  name = 'AddTransaction1783433760901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_action_enum" AS ENUM('BUY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_itemtype_enum" AS ENUM('TREE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."transactions_action_enum" NOT NULL DEFAULT 'BUY', "itemType" "public"."transactions_itemtype_enum" NOT NULL, "itemId" uuid NOT NULL, "itemName" character varying(100) NOT NULL, "price" integer NOT NULL, "lat" double precision, "lng" double precision, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_itemtype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_action_enum"`);
  }
}
