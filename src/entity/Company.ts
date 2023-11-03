import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EligibleEmployee } from './EligibleEmployee'

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  address: string

  @OneToMany(
    () => EligibleEmployee,
    (eligibleEmployee) => eligibleEmployee.company
  )
  eligibleEmployees: EligibleEmployee[]
}
