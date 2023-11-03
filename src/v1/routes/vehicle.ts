import express, { NextFunction, Request, Response } from 'express'
import {
  getAllVehicles,
  getVehicleById,
  getVehicleWithBookingInfo
} from '@app/repository/vehicle'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAllVehicles()

    return res.status(200).json({
      data
    })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await getVehicleById(id as string)

    return res.status(200).json({
      data
    })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

router.get(
  '/bookings',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query
      const data = await getVehicleWithBookingInfo(date as string)

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
