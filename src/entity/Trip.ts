import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Vehicle } from './Vehicle'
import { Booking } from './Booking'
import { TripStatus } from '@app/enums/trip'

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  date: Date

  @OneToMany((type) => Booking, (booking) => booking.trip, {
    nullable: true
  })
  bookings: Booking[]

  @ManyToOne((type) => Vehicle, (vehicle) => vehicle.trips, {
    nullable: true
  })
  vehicle: Vehicle

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PENDING
  })
  status: TripStatus
}
