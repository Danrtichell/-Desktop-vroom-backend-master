import express, { NextFunction, Request, Response } from 'express'
import { getEligibleEmployeesByCompanyId } from '@app/repository/company'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get(
  '/:id/eligible-employee',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getEligibleEmployeesByCompanyId(req.params.id)

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
