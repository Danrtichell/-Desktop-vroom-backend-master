import express, { NextFunction, Request, Response } from 'express'
import {
  getAllBookings,
  getBookingById,
  getCancelledBookingsPerDay,
  getCancelledBookingsPerDayDetails,
  getCommonCancelReasons,
  getCommonCancelReasonsDetails,
  getUnassignedBookings
} from '@app/repository/booking'
import { ErrorCode } from '@app/middleware'
import { BookingDirection } from '@app/enums/booking'

const router = express.Router()

router.get(
  '/pending',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId, date, direction = BookingDirection.HOME } = req.query
      const data = await getUnassignedBookings(
        locationId as string,
        date as string,
        direction as BookingDirection
      )

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAllBookings()

    res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    next({ name: ErrorCode.CannotReturnData })
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await getBookingById(id)

    res.status(200).json({ data })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

export default router
