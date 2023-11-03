import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Trip } from './Trip'
import { User } from './User'

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  plateNumber: string

  @Column({ nullable: true })
  vanNumber: string

  @Column()
  mileage: number

  @Column({ type: 'double precision', nullable: true })
  lat: number

  @Column({ type: 'double precision', nullable: true })
  lng: number

  @Column({ nullable: true })
  lastUpdatedCoords: Date

  @ManyToOne((type) => User, (driver) => driver.vehicle)
  driver: User

  @OneToMany((type) => Trip, (trip) => trip.vehicle)
  trips: Trip[]
}
