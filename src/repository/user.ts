import { Driver } from '@app/entity/Driver'
import { User } from '@app/entity/User'
import { getConnection, getRepository } from 'typeorm'

export const getUserByEmail = async (
  email: string
): Promise<Partial<User> | undefined> => {
  const repository = getConnection('default').getRepository(User)

  return await repository
    .createQueryBuilder('User')
    .select('User.id', 'id')
    .addSelect('User.email', 'email')
    .addSelect('User.firstName', 'firstName')
    .addSelect('User.lastName', 'lastName')
    .addSelect('User.password', 'password')
    .addSelect('User.type', 'type')
    .leftJoinAndSelect('User.location', 'location')
    .where('User.email = :email', { email })
    .getRawOne()
}

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const repository = getConnection('default').getRepository(User)

  return await repository
    .createQueryBuilder('User')
    .leftJoinAndSelect('User.location', 'location')
    .where('User.email = :email', { email })
    .getOne()
}

export const checkUserEmailExist = async (
  email: string
): Promise<Partial<User> | undefined> => {
  return getRepository(User)
    .createQueryBuilder('User')
    .select('User.id', 'id')
    .addSelect('User.email', 'email')
    .where('User.email = :email', { email })
    .getRawOne()
}

export const getUserPassengerProfile = async (
  userId: string
): Promise<Partial<User> | undefined> => {
  return getRepository(User).findOne(userId, {
    select: [
      'id',
      'firstName',
      'lastName',
      'email',
      'gender',
      'contactNumber',
      'address'
    ],
    relations: ['location']
  })
}

export const getUserDriverProfile = async (
  userId: string
): Promise<Partial<User> | undefined> => {
  return await getRepository(User)
    .createQueryBuilder('User')
    .select('User.id', 'id')
    .addSelect('User.firstName', 'firstName')
    .addSelect('User.lastName', 'lastName')
    .addSelect('User.email', 'email')
    .addSelect('User.gender', 'gender')
    .addSelect('User.contactNumber', 'contactNumber')
    .addSelect('User.address', 'address')
    .addSelect('User.type', 'type')
    .addSelect('User.licenseNumber', 'licenseNumber')
    .addSelect('User.licenseExpiry', 'licenseExpiry')
    .addSelect('User.emergencyContactName', 'emergencyContactName')
    .addSelect('User.emergencyContactNumber', 'emergencyContactNumber')
    .addSelect('User.driverStatus', 'driverStatus')
    .addSelect('Vehicle.id', 'vehicleId')
    .addSelect('Vehicle.plateNumber', 'plateNumber')
    .addSelect('Vehicle.vanNumber', 'vanNumber')
    .addSelect('Vehicle.lat', 'lat')
    .addSelect('Vehicle.lng', 'lng')
    .leftJoin('User.vehicle', 'Vehicle')
    .where('User.id = :userId', { userId })
    .getRawOne()
}
