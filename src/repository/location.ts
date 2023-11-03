import { Location } from '@app/entity/Location'
import { getRepository } from 'typeorm'

export const getLocationList = async (): Promise<
  Partial<Location[]> | undefined
> => {
  return getRepository(Location).find()
}

export const findLocationByNames = async (
  locationName: string,
  zoneName: string
): Promise<Location | undefined> => {
  const repository = getRepository(Location)

  return await repository
    .createQueryBuilder('Location')
    .leftJoinAndSelect('Location.zone', 'zone')
    .where('Location.name ilike :locationName and zone.name ilike :zoneName', {
      locationName,
      zoneName
    })
    .getOne()
}
