import { getConnection, getRepository } from 'typeorm'
import { Trip } from '@app/entity/Trip'
import { TripStatus } from '@app/enums/trip'

export const getTripById = (id: string): Promise<Trip | undefined> => {
  const repository = getConnection('default').getRepository(Trip)

  return repository
    .createQueryBuilder('Trip')
    .leftJoinAndSelect('Trip.vehicle', 'vehicle')
    .leftJoinAndSelect('vehicle.driver', 'driver')
    .leftJoinAndSelect('Trip.bookings', 'bookings')
    .leftJoinAndSelect('bookings.passenger', 'passenger')
    .leftJoinAndSelect('bookings.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where('Trip.id = :id', { id })
    .orderBy('bookings.date', 'ASC')
    .getOne()
}

export const getPendingTrips = (
  date: string,
  direction: number
): Promise<Trip[] | undefined> => {
  const repository = getConnection('default').getRepository(Trip)

  return repository
    .createQueryBuilder('Trip')
    .leftJoinAndSelect('Trip.vehicle', 'vehicle')
    .leftJoinAndSelect('Trip.bookings', 'bookings')
    .leftJoinAndSelect('bookings.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where(
      // eslint-disable-next-line quotes
      "Trip.status = :status and to_char(Trip.date, 'MM/DD/YYYY') = :date",
      {
        status: TripStatus.PENDING,
        date
      }
    )
    .andWhere('bookings.direction = :direction', { direction })
    .orderBy('bookings.date', 'ASC')
    .getMany()
}

export const getCompletedTrips = (
  dateStart: Date,
  dateEnd: Date
): Promise<Trip[] | undefined> => {
  const repository = getConnection('default').getRepository(Trip)

  return repository
    .createQueryBuilder('Trip')
    .leftJoinAndSelect('Trip.vehicle', 'vehicle')
    .leftJoinAndSelect('Trip.bookings', 'bookings')
    .leftJoinAndSelect('bookings.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .leftJoinAndSelect('vehicle.driver', 'driver')
    .where('Trip.date >= :dateStart and Trip.date <= :dateEnd', {
      dateStart,
      dateEnd
    })
    .orderBy('bookings.date', 'DESC')
    .getMany()
}

export const getDailyTripCount = (): Promise<Trip[] | undefined> => {
  const repository = getConnection('default').getRepository(Trip)

  return repository
    .createQueryBuilder('Trip')
    .select([
      // eslint-disable-next-line quotes
      "date_part('year', Trip.date) as year",
      // eslint-disable-next-line quotes
      "date_part('month', Trip.date) as month",
      // eslint-disable-next-line quotes
      "date_part('day', Trip.date) as day",
      'count(Trip.id) as count'
    ])
    .where('Trip.status = :status', { status: TripStatus.DONE })
    .groupBy(
      // eslint-disable-next-line quotes
      "date_part('year', Trip.date), date_part('month', Trip.date), date_part('day', Trip.date)"
    )
    .execute()
}

export const getDailyTripCountDetails = (
  date: string
): Promise<Trip[] | undefined> => {
  const repository = getConnection('default').getRepository(Trip)

  return repository
    .createQueryBuilder('Trip')
    .leftJoinAndSelect('Trip.bookings', 'bookings')
    .leftJoinAndSelect('bookings.passenger', 'passenger')
    .leftJoinAndSelect('bookings.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where(
      // eslint-disable-next-line quotes
      "Trip.status = :status and Trip.date between :start::date and :end::date + '1 day'::interval",
      {
        status: TripStatus.DONE,
        start: date,
        end: date
      }
    )
    .getMany()
}

export const setStatusTrip = async (
  id: string,
  status: TripStatus
): Promise<boolean | undefined> => {
  const repository = getRepository(Trip)
  const entity = await repository.update(id, {
    status
  })

  if (entity) {
    return true
  }

  return false
}
