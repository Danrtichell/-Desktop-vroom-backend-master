import { BookingImport } from '@app/entity/BookingImport'
import { Import } from '@app/entity/Import'
import { ImportStatus } from '@app/enums/import'
import { getManager, getRepository } from 'typeorm'

export const clearBookingImports = async () => {
  return getRepository(BookingImport).clear()
}

export const updateBatch = async (obj: Partial<Import>) => {
  const repository = getRepository(Import)
  const [batch] = await repository.findByIds([obj.id])

  if (batch && obj.id) {
    repository.update(obj.id, {
      ...obj
    })
  }
}

export const resetImportStatuses = async () => {
  const repository = getRepository(Import)

  return await repository
    .createQueryBuilder('Import')
    .update(Import)
    .set({ status: ImportStatus.CANCELLED })
    .where('status = :status', { status: ImportStatus.PENDING_CONFIRM })
    .execute()
}

export const getAll = () => {
  const repository = getRepository(Import)

  return repository
    .createQueryBuilder('Import')
    .orderBy('date', 'DESC')
    .getMany()
}

export const getBookingImportFailures = () => {
  const repository = getRepository(BookingImport)

  return repository
    .createQueryBuilder('BookingImport')
    .where('BookingImport.canImport = false')
    .getMany()
}

export const createNewImport = () => {
  const repository = getRepository(Import)

  return repository.save(repository.create())
}

export const addBookingImport = (obj: Partial<BookingImport>) => {
  const repository = getRepository(BookingImport)

  return repository.save(repository.create(obj))
}

export const acceptBatch = async (id: string) => {
  const manager = getManager()

  await manager.query(`
    insert into booking(date, direction, "passengerId", "locationId")
    select date, direction::booking_direction_enum, "passengerId", "locationId" from booking_import
    where booking_import."canImport" = true
  `)

  return updateBatch({
    id,
    status: ImportStatus.COMPLETED
  })
}
