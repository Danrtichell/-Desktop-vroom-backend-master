import express, { NextFunction, Request, Response } from 'express'
import { checkUserEmailExist, getUserByEmail } from '@app/repository/user'
import { checkEmailEligibility } from '@app/repository/eligibleEmployee'
import { registerPassenger } from '@app/repository/passenger'
import { compare } from '@app/utils/hash'
import generateSignedToken from '@app/utils/token'
import { ErrorCode } from '@app/middleware'

const { FLAVOR = 'prod' } = process.env

const router = express.Router()

const handleInvalidCreds = (res: Response, message = 'Invalid credentials') => {
  return res.status(401).json({
    message
  })
}

export const HandleUnauthorized = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'UnauthorizedError') {
    return handleInvalidCreds(res, 'Not allowed')
  }

  next()
}

export const OnlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user

  if (FLAVOR !== 'local' && user.type !== 'Admin') {
    return handleInvalidCreds(res, 'Not allowed')
  }

  next()
}

export const AllowList = (list: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = req.user

  if (FLAVOR !== 'local' && list.indexOf(user.type) === -1) {
    return handleInvalidCreds(res, 'Not allowed')
  }

  next()
}

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body.data
      const user = await getUserByEmail(email)

      if (user) {
        if (user.password && !compare(password, user.password)) {
          next({ name: ErrorCode.InvalidCredentials })
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userType = (user as any).type

          const payload = {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            type: userType
          }

          const token = generateSignedToken('90 days', payload)

          res.status(200).json({
            data: {
              token,
              type: userType
            }
          })
        }
      } else {
        next({ name: ErrorCode.InvalidCredentials })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/eligible/passenger',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body.data
      const isEmailExist = await checkUserEmailExist(email)

      if (isEmailExist) {
        next({ name: ErrorCode.DuplicateEmail })
      }

      const emailAllowed = await checkEmailEligibility(email)

      if (emailAllowed) {
        res.status(200).json({
          data: {
            eligible: true
          }
        })
      } else {
        next({ name: ErrorCode.NotEligibleEmail })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/register/passenger',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body.data
      const isEmailExist = await checkUserEmailExist(email)

      if (isEmailExist) {
        next({ name: ErrorCode.DuplicateEmail })
      }

      const user = await registerPassenger(req.body.data)

      if (user) {
        const userType = 'Passenger'
        const payload = {
          id: user.id,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          type: userType
        }

        const token = generateSignedToken('90 days', payload)

        res.status(200).json({
          data: {
            user,
            token,
            type: userType
          }
        })
      } else {
        next({ name: ErrorCode.CannotCreate })
      }
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
