import { getRepository } from 'typeorm'
import { Passenger } from '@app/entity/Passenger'
import { resourceLimits } from 'worker_threads'

type PickPassengerColumns = Pick<
  Passenger,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'contactNumber'
  | 'address'
  | 'email'
  | 'location'
>

export const registerPassenger = async (
  data: Passenger
): Promise<PickPassengerColumns | undefined> => {
  const repository = getRepository(Passenger)
  const entity = await repository.save(
    repository.create({
      ...data
    })
  )

  entity.password = ''

  return entity
}

export const getAllPassengers = async (): Promise<Passenger[] | undefined> => {
  const repository = getRepository(Passenger)

  const results = await repository
    .createQueryBuilder('Passenger')
    .leftJoinAndSelect('Passenger.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .getMany()

  return results.map((result: Passenger) => {
    result.password = ''
    result.passwordSalt = ''

    return result
  })
}

export const getPassengerById = async (
  id: string
): Promise<Passenger | undefined> => {
  const repository = getRepository(Passenger)

  const result = await repository
    .createQueryBuilder('Passenger')
    .leftJoinAndSelect('Passenger.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where('Passenger.id = :id', { id })
    .getOne()

  if (result) {
    result.password = ''
    result.passwordSalt = ''
  }

  return result
}
