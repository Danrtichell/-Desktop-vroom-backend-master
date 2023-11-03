import { Trip } from '@app/entity/Trip'
import { Vehicle } from '@app/entity/Vehicle'
import { BookingStatus } from '@app/enums/booking'
import { TripStatus } from '@app/enums/trip'
import { getConnection, getRepository } from 'typeorm'

export const getAllVehicles = async (): Promise<Vehicle[] | undefined> => {
  const repository = getRepository(Vehicle)

  return repository
    .createQueryBuilder('Vehicle')
    .leftJoinAndSelect('Vehicle.driver', 'driver')
    .getMany()
}

export const getVehicleById = async (
  id: string
): Promise<Vehicle | undefined> => {
  const repository = getRepository(Vehicle)

  return repository
    .createQueryBuilder('Vehicle')
    .leftJoinAndSelect('Vehicle.driver', 'driver')
    .where('Vehicle.id = :id', { id })
    .getOne()
}

export const getVehicleWithBookingInfo = async (
  date: string
): Promise<any[] | undefined> => {
  const repository = getConnection('default').getRepository(Vehicle)

  const results = repository
    .createQueryBuilder('Vehicle')
    .leftJoinAndSelect('Vehicle.trips', 'trip')
    .leftJoinAndSelect(
      'trip.bookings',
      'bookings',
      // eslint-disable-next-line prettier/prettier
      // eslint-disable-next-line quotes
      "(bookings.status = :status1 or bookings.status = :status2) and to_char(bookings.date, 'MM/DD/YYYY') = :date",
      {
        status1: BookingStatus.PENDING,
        status2: BookingStatus.INTRANSIT,
        date
      }
    )
    .leftJoinAndSelect('bookings.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .orderBy('bookings.date', 'ASC')

  return results.getMany()
}

export const getVehicleCurrentTrip = async (
  driverId: string,
  startDt: string,
  endDt: string
): Promise<Trip | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return (
    getRepository(Trip)
      .createQueryBuilder('Trip')
      .addSelect('passenger.id')
      .addSelect('passenger.firstName')
      .addSelect('passenger.lastName')
      .addSelect('location.name')
      .addSelect('location.lat')
      .addSelect('location.long')
      .addSelect('zone.name')
      .leftJoin('Trip.vehicle', 'vehicle')
      .leftJoin('vehicle.driver', 'driver')
      .leftJoinAndSelect('Trip.bookings', 'bookings')
      .leftJoin('bookings.location', 'location')
      .leftJoin('bookings.passenger', 'passenger')
      .leftJoin('location.zone', 'zone')
      .where(
        'driver.id = :driverId and (Trip.status = :tripStatus1 or Trip.status = :tripStatus2)',
        {
          driverId,
          tripStatus1: TripStatus.PENDING,
          tripStatus2: TripStatus.INTRANSIT
        }
      )
      // eslint-disable-next-line prettier/prettier
      // eslint-disable-next-line quotes
      .andWhere(
        // eslint-disable-next-line quotes
        'Trip.date BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate
        }
      )
      .orderBy('Trip.date', 'ASC')
      .getOne()
  )
}

export const getVehicleFutureTrips = async (
  driverId: string,
  startDt: string,
  endDt: string
): Promise<Trip[] | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return getRepository(Trip)
    .createQueryBuilder('Trip')
    .addSelect('passenger.id')
    .addSelect('passenger.firstName')
    .addSelect('passenger.lastName')
    .addSelect('location.name')
    .addSelect('location.lat')
    .addSelect('location.long')
    .addSelect('zone.name')
    .leftJoin('Trip.vehicle', 'vehicle')
    .leftJoin('vehicle.driver', 'driver')
    .leftJoinAndSelect('Trip.bookings', 'bookings')
    .leftJoin('bookings.location', 'location')
    .leftJoin('bookings.passenger', 'passenger')
    .leftJoin('location.zone', 'zone')
    .where(
      'driver.id = :driverId and (Trip.status = :tripStatus1 or Trip.status = :tripStatus2)',
      {
        driverId,
        tripStatus1: TripStatus.PENDING,
        tripStatus2: TripStatus.INTRANSIT
      }
    )
    .andWhere(
      // eslint-disable-next-line quotes
      'Trip.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .orderBy('Trip.date', 'ASC')
    .getMany()
}

export const getVehicleHistoryTrips = async (
  driverId: string,
  startDt: string,
  endDt: string
): Promise<Trip[] | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return (
    getRepository(Trip)
      .createQueryBuilder('Trip')
      .addSelect('passenger.id')
      .addSelect('passenger.firstName')
      .addSelect('passenger.lastName')
      .addSelect('location.name')
      .addSelect('location.lat')
      .addSelect('location.long')
      .addSelect('zone.name')
      .leftJoin('Trip.vehicle', 'vehicle')
      .leftJoin('vehicle.driver', 'driver')
      .leftJoinAndSelect('Trip.bookings', 'bookings')
      .leftJoin('bookings.location', 'location')
      .leftJoin('bookings.passenger', 'passenger')
      .leftJoin('location.zone', 'zone')
      .where(
        'driver.id = :driverId and (Trip.status = :tripStatus1 or Trip.status = :tripStatus2)',
        {
          driverId,
          tripStatus1: TripStatus.DONE,
          tripStatus2: TripStatus.CANCELLED
        }
      )
      // eslint-disable-next-line prettier/prettier
      // eslint-disable-next-line quotes
      .andWhere(
        // eslint-disable-next-line quotes
        'Trip.date BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate
        }
      )
      .orderBy('Trip.date', 'ASC')
      .getMany()
  )
}

export const setVehicleCoordinates = async (
  id: string,
  lat: number,
  lng: number,
  lastUpdatedCoords: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Vehicle)
  const entity = await repository.update(id, {
    lat,
    lng,
    lastUpdatedCoords
  })

  if (entity) {
    return true
  }

  return false
}
