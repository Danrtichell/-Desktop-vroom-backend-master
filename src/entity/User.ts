import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm'
import { hash } from '@app/utils/hash'
import { Gender } from '@app/enums/gender'
import { Booking } from './Booking'
import { Vehicle } from './Vehicle'
import { Location } from './Location'
import { UserClaim } from './UserClaim'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  password: string

  @Column({ nullable: true })
  passwordSalt: string

  @Column({ nullable: true })
  address: string

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE
  })
  gender: Gender

  @Column({ nullable: true })
  contactNumber: string

  @Column({ nullable: true })
  points: number

  @OneToMany((type) => UserClaim, (entity) => entity.passenger)
  claims: UserClaim[]

  @OneToMany((type) => Booking, (booking) => booking.passenger)
  bookings: Booking[]

  @OneToOne((type) => Vehicle, (vehicle) => vehicle.driver)
  vehicle: Vehicle

  @ManyToOne(() => Location, (loc) => loc.passenger, {
    nullable: true
  })
  location: Location

  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    if (this.password && this.password !== '') {
      this.password = hash(this.password)
    }
  }

  @BeforeUpdate()
  async beforeUpdate(): Promise<void> {
    if (this.password && this.password !== '') {
      this.password = hash(this.password)
    }
  }
}
