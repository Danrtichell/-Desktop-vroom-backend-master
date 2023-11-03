/* eslint-disable indent */

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTemperatureColumnToBooking1612752068894
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "booking" ADD COLUMN "temperature" varchar(10) NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "booking" DROP COLUMN "temperature"')
  }
}
