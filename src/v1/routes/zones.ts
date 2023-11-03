import express, { NextFunction, Request, Response } from 'express'
import {
  getLocationsByZoneId,
  getZonesWithBookings
} from '@app/repository/zone'
import { ErrorCode } from '@app/middleware'
import { BookingDirection } from '@app/enums/booking'

const router = express.Router()

router.get(
  '/:id/locations',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getLocationsByZoneId(req.params.id)

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/bookings',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, direction = BookingDirection.HOME } = req.query
      const data = await getZonesWithBookings(
        date as string,
        direction as BookingDirection
      )

      return res.status(200).json({
        data
      })
    } catch (error) {
      console.log('test')
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
