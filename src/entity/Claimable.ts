import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserClaim } from './UserClaim'

@Entity()
export class Claimable {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  description: string

  @Column()
  count: number

  @Column({ nullable: true })
  price: number

  @Column()
  name: string

  @Column({ nullable: true })
  image: string

  @ManyToMany((type) => UserClaim, (entity) => entity.claimable)
  claimable: UserClaim
}
