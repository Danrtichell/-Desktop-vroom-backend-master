import { HOURS_24_MS } from '@app/constants'
import { Booking } from '@app/entity/Booking'
import { Location } from '@app/entity/Location'
import { Zone } from '@app/entity/Zone'
import { BookingDirection } from '@app/enums/booking'
import { getConnection, getRepository } from 'typeorm'

export const getLocationsByZoneId = async (
  zoneId: string
): Promise<Location[]> => {
  const repository = getConnection('default').getRepository(Location)

  return await repository
    .createQueryBuilder('Location')
    .where('Location.zoneId = :zoneId', { zoneId })
    .getMany()
}

export const getZonesWithBookings = async (
  date: string | null,
  direction: BookingDirection
): Promise<Zone[] | undefined> => {
  const repository = getConnection('default').getRepository(Zone)
  const startDate = new Date(date as string)
  const endDate = new Date(date as string)
  endDate.setTime(startDate.getTime() + HOURS_24_MS)

  const results = repository
    .createQueryBuilder('Zone')
    .select('COUNT(Booking.id) as count, Zone.id, Zone.name')
    .leftJoin('location', 'Location', 'Location.zoneId = Zone.id')
    .leftJoin(
      'booking',
      'Booking',
      'Booking.locationId = Location.id and Booking.tripId is null'
    )
    .groupBy('Zone.id, Zone.name')
    .orderBy('count', 'DESC')

  if (date && date !== '') {
    // eslint-disable-next-line prettier/prettier
    results.where('Booking.date >= :startDate and Booking.date <= :endDate', {
      startDate,
      endDate
    })
  }
  results.andWhere('Booking.direction = :direction', { direction })

  return results.getRawMany()
}

export const getZonesWithLocations = async (): Promise<
  Partial<Zone[]> | undefined
> => {
  return getRepository(Zone).find({ relations: ['locations'] })
}
