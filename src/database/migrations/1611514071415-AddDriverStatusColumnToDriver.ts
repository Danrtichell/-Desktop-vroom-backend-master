/* eslint-disable indent */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDriverStatusColumnToDriver1611514071415
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD COLUMN "driverStatus" int NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "driverStatus"')
  }
}
