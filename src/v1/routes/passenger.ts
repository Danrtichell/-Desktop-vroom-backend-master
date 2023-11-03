import express, { NextFunction, Request, Response } from 'express'
import { User } from '@app/entity/User'
import { Location } from '@app/entity/Location'
import { getZonesWithLocations } from '@app/repository/zone'
import { getLocationList } from '@app/repository/location'
import { getAllPassengers, getPassengerById } from '@app/repository/passenger'
import {
  cancelPassengerBooking,
  confirmArrivalPassengerBooking,
  createPassengerBooking,
  getCurrentBookingForPassenger,
  getOtherPassengersForTrip,
  getPassengerActivityBookings,
  getPassengerHistoryBookings
} from '@app/repository/booking'
import { BookingDirection, BookingStatus } from '@app/enums/booking'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get(
  '/zones/locations',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getZonesWithLocations()

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/locations',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getLocationList()

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/bookings/activity',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getPassengerActivityBookings(
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
  '/bookings/history',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getPassengerHistoryBookings(
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
  '/booking/create',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { bookDateTime, bookFrom, bookTo } = req.body.data

      const bookingInfo = {
        date: bookDateTime,
        passenger: user,
        location: bookFrom as Location,
        direction:
          bookTo === 'Home' ? BookingDirection.HOME : BookingDirection.OFFICE,
        status: BookingStatus.PENDING
      }
      const data = await createPassengerBooking(bookingInfo)

      res.status(200).json({ data })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.get(
  '/booking/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User
      const { startDate, endDate } = req.query
      const data = await getCurrentBookingForPassenger(
        user.id,
        startDate as string,
        endDate as string
      )
      let others = undefined

      if (data && data.trip) {
        others = await getOtherPassengersForTrip(
          data.id,
          data.trip.id,
          startDate as string,
          endDate as string
        )
      }

      res.status(200).json({
        data: {
          myBooking: data,
          othersBooking: others
        }
      })
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
      const isSuccess = await confirmArrivalPassengerBooking(id, arrivalDate)

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
  '/booking/cancel',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '', cancelReason = '' } = req.body.data
      const isSuccess = await cancelPassengerBooking(id, cancelReason)

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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAllPassengers()

    res.status(200).json({ data })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = await getPassengerById(id)

    res.status(200).json({ data })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

export default router
