import { EligibleEmployee } from '@app/entity/EligibleEmployee'
import { getRepository } from 'typeorm'

export const getEligibleEmployeesByCompanyId = async (
  companyId: string
): Promise<EligibleEmployee[]> => {
  return getRepository(EligibleEmployee).find({ where: { company: companyId } })
}
