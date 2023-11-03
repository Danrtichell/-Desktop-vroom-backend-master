import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Location } from './Location'
import { BookingDirection, BookingImportDirection } from '@app/enums/booking'
import { Import } from './Import'

@Entity()
export class BookingImport {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  date: Date

  @Column({
    type: 'enum',
    enum: BookingDirection,
    enumName: 'booking_direction_enum',
    default: BookingDirection.HOME
  })
  direction: BookingDirection

  @ManyToOne((type) => User, (user) => user.bookings)
  passenger: User

  @ManyToOne((type) => Location, (loc) => loc.bookings)
  location: Location

  @ManyToOne(() => Import, (imp) => imp.bookingImports)
  batch: Import

  @Column({ default: false })
  canImport: boolean

  @Column({ nullable: true })
  comment: string
}
