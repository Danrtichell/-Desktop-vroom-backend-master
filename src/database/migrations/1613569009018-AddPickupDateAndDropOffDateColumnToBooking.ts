/* eslint-disable indent */

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPickupDateAndDropOffDateColumnToBooking1613569009018
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "booking" ADD COLUMN "pickupDate" TIMESTAMP NULL, ADD COLUMN "dropOffDate" TIMESTAMP NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "booking" DROP COLUMN "pickupDate", DROP COLUMN dropOffDate'
    )
  }
}
