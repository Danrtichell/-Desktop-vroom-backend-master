/* eslint-disable indent */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLastUpdatedCoordsColumnToVehicle1614439788313
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle" ADD COLUMN "lastUpdatedCoords" TIMESTAMP NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "vehicle" DROP COLUMN "lastUpdatedCoords"'
    )
  }
}
