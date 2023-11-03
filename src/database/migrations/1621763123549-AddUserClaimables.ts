/* eslint-disable indent */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserclaimables1621763123549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ADD COLUMN "points" int NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "points"')
  }
}
