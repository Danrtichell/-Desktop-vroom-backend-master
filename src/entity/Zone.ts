import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Location } from './Location'

@Entity()
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany((type) => Location, (location) => location.zone)
  locations: Location[]
}
