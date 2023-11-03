import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddClaimables1621763878241 implements MigrationInterface {
  name = 'AddClaimables1621763878241'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line quotes
      `CREATE TABLE "claimable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "count" integer NOT NULL, "price" integer, "name" character varying NOT NULL, "image" character varying, CONSTRAINT "PK_10daa69a3753f3501b1a40993a1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      // eslint-disable-next-line quotes
      `CREATE TABLE "user_claim" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_9a1ce748011a079cd9bed179d54" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // eslint-disable-next-line quotes
    await queryRunner.query(`DROP TABLE "user_claim"`)
    // eslint-disable-next-line quotes
    await queryRunner.query(`DROP TABLE "claimable"`)
  }
}
