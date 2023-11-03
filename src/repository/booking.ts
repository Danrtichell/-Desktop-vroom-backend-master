import { getConnection, getRepository } from 'typeorm'
import { Booking } from '@app/entity/Booking'
import {
  BookingArrivalStatus,
  BookingDirection,
  BookingStatus
} from '@app/enums/booking'
import { HOURS_24_MS } from '@app/constants'

export const getAllBookings = async (): Promise<Booking[] | undefined> => {
  const repository = getConnection('default').getRepository(Booking)

  const results = await repository
    .createQueryBuilder('Booking')
    .leftJoinAndSelect('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('trip.vehicle', 'vehicle')
    .leftJoinAndSelect('Booking.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .orderBy('Booking.date', 'ASC')
    .getMany()

  // Manually remove unwanted fields for now
  return results.map((result: Booking) => {
    if (result.passenger) {
      result.passenger.password = ''
      result.passenger.passwordSalt = ''
    }

    return result
  })
}

export const getCancelledBookingsPerDay = async (): Promise<
  Booking[] | undefined
> => {
  const repository = getConnection('default').getRepository(Booking)

  return repository
    .createQueryBuilder('Booking')
    .select([
      // eslint-disable-next-line quotes
      "date_part('year', Booking.date) as year",
      // eslint-disable-next-line quotes
      "date_part('month', Booking.date) as month",
      // eslint-disable-next-line quotes
      "date_part('day', Booking.date) as day",
      'count(Booking.id) as count'
    ])
    .where('Booking.status = :status', { status: BookingStatus.CANCELLED })
    .groupBy(
      // eslint-disable-next-line quotes
      "date_part('year', Booking.date), date_part('month', Booking.date), date_part('day', Booking.date)"
    )
    .execute()
}

export const getCancelledBookingsPerDayDetails = async (
  date: string
): Promise<Booking[] | undefined> => {
  const repository = getConnection('default').getRepository(Booking)

  return repository
    .createQueryBuilder('Booking')
    .leftJoinAndSelect('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('trip.vehicle', 'vehicle')
    .leftJoinAndSelect('Booking.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where(
      // eslint-disable-next-line quotes
      "Booking.status = :status and Booking.date between :start::date and :end::date + '1 day'::interval",
      {
        status: BookingStatus.CANCELLED,
        start: date,
        end: date
      }
    )
    .getMany()
}

export const getCommonCancelReasons = async (): Promise<
  Booking[] | undefined
> => {
  const repository = getConnection('default').getRepository(Booking)

  return repository
    .createQueryBuilder('Booking')
    .select(['Booking.cancelReason as reason', 'count(Booking.id) as count'])
    .where('Booking.status = :status and Booking.cancelReason is not null', {
      status: BookingStatus.CANCELLED
    })
    .groupBy('Booking.cancelReason')
    .execute()
}

export const getCommonCancelReasonsDetails = async (
  reason: string
): Promise<Booking[] | undefined> => {
  const repository = getConnection('default').getRepository(Booking)

  return repository
    .createQueryBuilder('Booking')
    .leftJoinAndSelect('Booking.passenger', 'passenger')
    .where(
      'Booking.status = :status and Booking.cancelReason is not null and Booking.cancelReason ilike :reason',
      {
        status: BookingStatus.CANCELLED,
        reason
      }
    )
    .getMany()
}

export const getUnassignedBookings = async (
  locationId: string,
  date: string | null,
  direction: BookingDirection
): Promise<Booking[] | undefined> => {
  const repository = getConnection('default').getRepository(Booking)
  const condition = 'Booking.tripId is null and location.zoneId = :locationId'
  const startDate = new Date(date as string)
  const endDate = new Date(date as string)
  endDate.setTime(startDate.getTime() + HOURS_24_MS)

  const results = await repository
    .createQueryBuilder('Booking')
    .leftJoinAndSelect('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('Booking.location', 'location')
    .leftJoinAndSelect('location.zone', 'zone')
    .where(condition, {
      locationId
    })
    .andWhere(
      // eslint-disable-next-line quotes
      'Booking.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .andWhere('Booking.direction = :direction', { direction })
    .orderBy('Booking.date', 'ASC')
    .getMany()

  // Manually remove unwanted fields for now
  return results.map((result: Booking) => {
    if (result.passenger) {
      result.passenger.password = ''
      result.passenger.passwordSalt = ''
    }

    return result
  })
}

export const getBookingById = async (
  bookingId: string
): Promise<Booking | undefined> => {
  const repository = getConnection('default').getRepository(Booking)

  const result = await repository
    .createQueryBuilder('Booking')
    .leftJoinAndSelect('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('Booking.location', 'location')
    .where('Booking.id = :bookingId', { bookingId })
    .getOne()

  // Manually remove unwanted fields for now
  if (result && result.passenger) {
    result.passenger.password = ''
    result.passenger.passwordSalt = ''
  }

  return result
}

export const getCurrentBookingForPassenger = async (
  passengerId: string,
  startDt: string,
  endDt: string
): Promise<Booking | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return getRepository(Booking)
    .createQueryBuilder('Booking')
    .addSelect('passenger.id')
    .addSelect('passenger.firstName')
    .addSelect('passenger.lastName')
    .addSelect('driver.id')
    .addSelect('driver.firstName')
    .addSelect('driver.lastName')
    .leftJoin('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('trip.vehicle', 'vehicle')
    .leftJoin('vehicle.driver', 'driver')
    .leftJoinAndSelect('Booking.location', 'location')
    .where(
      'Booking.passengerId = :passengerId AND (Booking.status = :bookingStatus1 OR Booking.status = :bookingStatus2 OR Booking.status = :bookingStatus3)',
      {
        passengerId,
        bookingStatus1: BookingStatus.PENDING,
        bookingStatus2: BookingStatus.INTRANSIT,
        bookingStatus3: BookingStatus.ONBOARDED
      }
    )
    .andWhere(
      // eslint-disable-next-line quotes
      'Booking.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .orderBy('Booking.date', 'ASC')
    .getOne()
}

export const getOtherPassengersForTrip = async (
  bookingId: string,
  tripId: string,
  startDt: string,
  endDt: string
): Promise<Booking[] | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return getRepository(Booking)
    .createQueryBuilder('Booking')
    .addSelect('passenger.id')
    .leftJoin('Booking.passenger', 'passenger')
    .leftJoinAndSelect('Booking.location', 'location')
    .where('Booking.tripId = :tripId', { tripId })
    .andWhere(
      'Booking.id != :bookingId AND (Booking.status = :bookingStatus1 or Booking.status = :bookingStatus2 or Booking.status = :bookingStatus3)',
      {
        bookingId,
        bookingStatus1: BookingStatus.PENDING,
        bookingStatus2: BookingStatus.INTRANSIT,
        bookingStatus3: BookingStatus.ONBOARDED
      }
    )
    .andWhere(
      // eslint-disable-next-line quotes
      'Booking.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .getMany()
}

export const getPassengerActivityBookings = async (
  passengerId: string,
  startDt: string,
  endDt: string
): Promise<Partial<Booking[]> | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return getRepository(Booking)
    .createQueryBuilder('Booking')
    .addSelect('driver.id')
    .addSelect('driver.firstName')
    .addSelect('driver.lastName')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('trip.vehicle', 'vehicle')
    .leftJoin('vehicle.driver', 'driver')
    .leftJoinAndSelect('Booking.location', 'location')
    .where(
      'Booking.passengerId = :passengerId AND (Booking.status = :bookingStatus1 OR Booking.status = :bookingStatus2 OR Booking.status = :bookingStatus3)',
      {
        passengerId,
        bookingStatus1: BookingStatus.PENDING,
        bookingStatus2: BookingStatus.INTRANSIT,
        bookingStatus3: BookingStatus.ONBOARDED
      }
    )
    .andWhere(
      // eslint-disable-next-line quotes
      'Booking.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .orderBy('Booking.date', 'ASC')
    .getMany()
}

export const getPassengerHistoryBookings = async (
  passengerId: string,
  startDt: string,
  endDt: string
): Promise<Partial<Booking[]> | undefined> => {
  const startDate = new Date(startDt as string)
  const endDate = new Date(endDt as string)

  return getRepository(Booking)
    .createQueryBuilder('Booking')
    .addSelect('driver.id')
    .addSelect('driver.firstName')
    .addSelect('driver.lastName')
    .leftJoinAndSelect('Booking.trip', 'trip')
    .leftJoinAndSelect('trip.vehicle', 'vehicle')
    .leftJoin('vehicle.driver', 'driver')
    .leftJoinAndSelect('Booking.location', 'location')
    .where(
      'Booking.passengerId = :passengerId AND (Booking.status = :bookingStatus1 OR Booking.status = :bookingStatus2)',
      {
        passengerId,
        bookingStatus1: BookingStatus.COMPLETED,
        bookingStatus2: BookingStatus.CANCELLED
      }
    )
    .andWhere(
      // eslint-disable-next-line quotes
      'Booking.date BETWEEN :startDate AND :endDate',
      {
        startDate,
        endDate
      }
    )
    .orderBy('Booking.date', 'ASC')
    .getMany()
}

export const createPassengerBooking = async (
  data: Pick<
    Booking,
    'date' | 'passenger' | 'location' | 'direction' | 'status'
  >
): Promise<Partial<Booking> | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.save(
    repository.create({
      ...data
    })
  )

  return entity
}

export const confirmArrivalPassengerBooking = async (
  id: string,
  passengerArrivalDate: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    passengerArrivalStatus: BookingArrivalStatus.ALREADY_ARRIVED,
    passengerArrivalDate
  })

  if (entity) {
    return true
  }

  return false
}

export const confirmArrivalDriverBooking = async (
  id: string,
  driverArrivalDate: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    driverArrivalStatus: BookingArrivalStatus.ALREADY_ARRIVED,
    driverArrivalDate
  })

  if (entity) {
    return true
  }

  return false
}

export const confirmTemperatureDriverBooking = async (
  id: string,
  temperature: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    temperature
  })

  if (entity) {
    return true
  }

  return false
}

export const confirmPickUpDriverBooking = async (
  id: string,
  pickupDate: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    status: BookingStatus.ONBOARDED,
    pickupDate
  })

  if (entity) {
    return true
  }

  return false
}

export const confirmCompletedDriverBooking = async (
  id: string,
  dropOffDate: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    status: BookingStatus.COMPLETED,
    dropOffDate
  })

  if (entity) {
    return true
  }

  return false
}

export const cancelPassengerBooking = async (
  id: string,
  cancelReason: string
): Promise<boolean | undefined> => {
  const repository = getRepository(Booking)
  const entity = await repository.update(id, {
    status: BookingStatus.CANCELLED,
    cancelReason
  })

  if (entity) {
    return true
  }

  return false
}
