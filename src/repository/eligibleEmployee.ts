import { EligibleEmployee } from '@app/entity/EligibleEmployee'
import { getRepository } from 'typeorm'

export const checkEmailEligibility = async (
  email: string
): Promise<Partial<EligibleEmployee> | undefined> => {
  return getRepository(EligibleEmployee).findOne({ where: { email } })
}
