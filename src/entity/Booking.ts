import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Location } from './Location'
import {
  BookingArrivalStatus,
  BookingDirection,
  BookingStatus
} from '@app/enums/booking'
import { Trip } from './Trip'

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  date: Date

  @Column({
    type: 'enum',
    enum: BookingDirection,
    default: BookingDirection.HOME
  })
  direction: BookingDirection

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus

  @Column({
    type: 'enum',
    enum: BookingArrivalStatus,
    default: BookingArrivalStatus.NOT_YET_ARRIVED
  })
  passengerArrivalStatus: BookingArrivalStatus

  @Column({ nullable: true })
  passengerArrivalDate: Date

  @Column({
    type: 'enum',
    enum: BookingArrivalStatus,
    default: BookingArrivalStatus.NOT_YET_ARRIVED
  })
  driverArrivalStatus: BookingArrivalStatus

  @Column({ nullable: true })
  driverArrivalDate: Date

  @Column({ nullable: true })
  pickupDate: Date

  @Column({ nullable: true })
  dropOffDate: Date

  @ManyToOne((type) => Trip, (trip) => trip.bookings, {
    nullable: true
  })
  trip: Trip

  @ManyToOne((type) => User, (user) => user.bookings)
  passenger: User

  @ManyToOne((type) => Location, (loc) => loc.bookings)
  location: Location

  @Column({ nullable: true })
  cancelReason: string

  @Column({ nullable: true })
  temperature: string
}
