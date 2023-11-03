import express, { NextFunction, Request, Response } from 'express'
import { User } from '@app/entity/User'
import {
  getUserDriverProfile,
  getUserPassengerProfile
} from '@app/repository/user'
import { ErrorCode } from '@app/middleware'

const router = express.Router()

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userType = (user as any).type
    let data

    if (userType === 'Passenger') {
      data = await getUserPassengerProfile(user.id)
    } else if (userType === 'Driver') {
      data = await getUserDriverProfile(user.id)
    }

    return res.status(200).json({
      data
    })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

export default router
