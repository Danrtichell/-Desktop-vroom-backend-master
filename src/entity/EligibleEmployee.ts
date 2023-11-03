import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './Company'

@Entity()
export class EligibleEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Company, (company) => company.eligibleEmployees)
  company: Company

  @Column()
  email: string
}
