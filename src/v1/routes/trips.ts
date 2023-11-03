import express, { NextFunction, Request, Response } from 'express'
import {
  getCompletedTrips,
  getDailyTripCount,
  getDailyTripCountDetails,
  getPendingTrips,
  getTripById
} from '@app/repository/trip'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get(
  '/pending',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, zone, direction } = req.query
      const data = await getPendingTrips(
        date as string,
        parseInt(direction as string)
      )

      res.status(200).json({ data })
    } catch (error) {
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

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await getTripById(id)

    res.status(200).json({ data })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

export default router
