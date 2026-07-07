import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTree1783430465591 implements MigrationInterface {
  name = 'AddTree1783430465591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "trees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "price" integer NOT NULL DEFAULT '100', "ownerId" uuid, CONSTRAINT "PK_916905d3ddf29a431776817cd8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61ebaa265d02afba44560af956" ON "trees" USING gist ("location") `,
    );
    await queryRunner.query(
      `ALTER TABLE "trees" ADD CONSTRAINT "FK_9d2699acfd85297a87cf89961aa" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trees" DROP CONSTRAINT "FK_9d2699acfd85297a87cf89961aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61ebaa265d02afba44560af956"`,
    );
    await queryRunner.query(`DROP TABLE "trees"`);
  }
}
