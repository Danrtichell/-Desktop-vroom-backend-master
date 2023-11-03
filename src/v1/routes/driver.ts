import express, { NextFunction, Request, Response } from 'express'
import {
  getVehicleCurrentTrip,
  getVehicleFutureTrips,
  getVehicleHistoryTrips,
  setVehicleCoordinates
} from '@app/repository/vehicle'
import {
  confirmArrivalDriverBooking,
  confirmCompletedDriverBooking,
  confirmPickUpDriverBooking,
  confirmTemperatureDriverBooking
} from '@app/repository/booking'
import { ErrorCode } from '@app/middleware'
import { User } from '@app/entity/User'
import { setStatusTrip } from '@app/repository/trip'

const router = express.Router()

router.get(
  '/trip/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getVehicleCurrentTrip(
        user.id,
        startDate as string,
        endDate as string
      )

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/trips/activity',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getVehicleFutureTrips(
        user.id,
        startDate as string,
        endDate as string
      )

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/trips/history',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getVehicleHistoryTrips(
        user.id,
        startDate as string,
        endDate as string
      )

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/booking/arrived',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', arrivalDate } = req.body.data
      const isSuccess = await confirmArrivalDriverBooking(id, arrivalDate)

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/booking/temperature',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', temperature = '' } = req.body.data
      const isSuccess = await confirmTemperatureDriverBooking(id, temperature)

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/booking/pickup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', pickupDate } = req.body.data
      const isSuccess = await confirmPickUpDriverBooking(id, pickupDate)

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/booking/completed',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', dropOffDate } = req.body.data
      const isSuccess = await confirmCompletedDriverBooking(id, dropOffDate)

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/trip/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', status = '' } = req.body.data
      const isSuccess = await setStatusTrip(id, status)

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/vehicle/coordinates',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', lat, lng, lastUpdatedCoords } = req.body.data
      const isSuccess = await setVehicleCoordinates(
        id,
        lat,
        lng,
        lastUpdatedCoords
      )

      if (isSuccess) {
        res.status(200).json({ data: { isSuccess } })
      } else {
        next({ name: ErrorCode.CannotUpdate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
