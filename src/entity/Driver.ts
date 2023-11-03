import { ChildEntity, Column } from 'typeorm'
import { User } from '@app/entity/User'
import { DriverStatus, DriverStatus2 } from '@app/enums/driver'

@ChildEntity()
export class Driver extends User {
  @Column()
  licenseNumber: string

  @Column()
  licenseExpiry: Date

  @Column()
  hireDate: Date

  @Column()
  emergencyContactName: string

  @Column()
  emergencyContactNumber: string

  @Column({
    type: 'enum',
    enum: DriverStatus
  })
  status: DriverStatus

  @Column({
    type: 'enum',
    enum: DriverStatus2
  })
  driverStatus: DriverStatus2
}
