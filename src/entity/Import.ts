import { ImportStatus } from '@app/enums/import'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BookingImport } from './BookingImport'

@Entity()
export class Import {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date

  @Column({ nullable: true })
  total: number

  @Column({ nullable: true })
  failed: number

  @Column({
    type: 'enum',
    enum: ImportStatus,
    default: ImportStatus.INPROGRESS
  })
  status: ImportStatus

  @OneToMany(() => BookingImport, (bi) => bi.batch)
  bookingImports: BookingImport[]
}
