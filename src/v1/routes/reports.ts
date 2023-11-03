import express, { NextFunction, Request, Response } from 'express'
import {
  getCompletedTrips,
  getDailyTripCount,
  getDailyTripCountDetails
} from '@app/repository/trip'
import {
  getCancelledBookingsPerDay,
  getCancelledBookingsPerDayDetails,
  getCommonCancelReasons,
  getCommonCancelReasonsDetails
} from '@app/repository/booking'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get(
  '/cancelled-per-day',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getCancelledBookingsPerDay()

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/cancelled-per-day-details',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query
      const data = await getCancelledBookingsPerDayDetails(date as string)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/cancel-reasons',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getCommonCancelReasons()

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/cancel-reasons-details',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.query
      const data = await getCommonCancelReasonsDetails(reason as string)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/completed',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { dateStart, dateEnd } = req.query
      const data = await getCompletedTrips(
        new Date(dateStart as string),
        new Date(dateEnd as string)
      )

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/daily-count',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getDailyTripCount()

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/daily-count-details',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query
      const data = await getDailyTripCountDetails(date as string)

      res.status(200).json({ data })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)
export default router
