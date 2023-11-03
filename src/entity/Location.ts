import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Booking } from './Booking'
import { Zone } from './Zone'
import { User } from './User'

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ type: 'double precision', nullable: true })
  lat: number

  @Column({ type: 'double precision', nullable: true })
  long: number

  @ManyToOne((type) => Zone, (zone) => zone.locations)
  zone: Zone

  @OneToMany((type) => Booking, (booking) => booking.location)
  bookings: Booking[]

  @OneToMany(() => User, (user) => user.location)
  passenger: User
}
