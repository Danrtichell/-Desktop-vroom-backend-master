import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Claimable } from './Claimable'

@Entity()
export class UserClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date

  @OneToOne((type) => User, (entity) => entity.claims)
  passenger: User

  @OneToOne((type) => User, (entity) => entity.bookings)
  claimable: Claimable
}
