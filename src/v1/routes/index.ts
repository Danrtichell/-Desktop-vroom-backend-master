import express, { Request, Response, Router } from 'express'
import jwt from 'express-jwt'
import Routing from '@app/utils/routing'
import { JWT_ALGORITHM } from '@app/constants'

// models
import { Booking } from '@app/entity/Booking'
import { Vehicle } from '@app/entity/Vehicle'
import { Company } from '@app/entity/Company'
import { Driver } from '@app/entity/Driver'
import { Zone } from '@app/entity/Zone'
import { Location } from '@app/entity/Location'
import { Passenger } from '@app/entity/Passenger'
import { EligibleEmployee } from '@app/entity/EligibleEmployee'
import { Import } from '@app/entity/Import'
import { Trip } from '@app/entity/Trip'

// custom route handlers
import VehicleCustomRoutes from './vehicle'
import ZoneCustomRoutes from './zones'
import BookingCustomRoutes from './booking'
import PassengerCustomRoutes from './passenger'
import DriverCustomRoutes from './driver'
import UserCustomRoutes from './user'
import ImportCustomRoutes from './import'
import TripCustomRoutes from './trips'
import CompanyCustomRoutes from './company'
import ReportRoutes from './reports'
import AuthRoutes, { AllowList, HandleUnauthorized, OnlyAdmin } from './auth'
import { Claimable } from '@app/entity/Claimable'
import { UserClaim } from '@app/entity/UserClaim'

const { JWT_SECRET = '', FLAVOR = 'prod' } = process.env

class Version1Route {
  public router: Router

  constructor() {
    this.router = express.Router()
    this.setConfig()
  }

  public setConfig() {
    this.router.get('/version', [], (req: Request, res: Response) => {
      res.send('Version 1.0 route')
    })

    if (FLAVOR === 'prod') {
      this.router.use(
        jwt({ secret: JWT_SECRET, algorithms: [JWT_ALGORITHM] }).unless({
          path: [
            '/api/auth/login',
            '/api/auth/eligible/passenger',
            '/api/auth/register/passenger',
            '/api/passengers/zones/locations',
            '/api/passengers/locations'
          ]
        })
      )
    }

    this.router.use(HandleUnauthorized)
    this.router.use('/auth', AuthRoutes)
    this.router.use('/vehicles', OnlyAdmin, VehicleCustomRoutes)
    this.router.use('/vehicles', OnlyAdmin, Routing.create<Vehicle>(Vehicle))
    this.router.use('/company', CompanyCustomRoutes)
    this.router.use('/company', OnlyAdmin, Routing.create<Company>(Company))
    this.router.use(
      '/eligible-employee',
      OnlyAdmin,
      Routing.create<EligibleEmployee>(EligibleEmployee)
    )
    this.router.use('/drivers', DriverCustomRoutes)
    this.router.use('/drivers', OnlyAdmin, Routing.create<Driver>(Driver))
    this.router.use('/zones', OnlyAdmin, ZoneCustomRoutes)
    this.router.use('/zones', OnlyAdmin, Routing.create<Zone>(Zone))
    this.router.use('/locations', OnlyAdmin, Routing.create<Location>(Location))
    this.router.use('/passengers', PassengerCustomRoutes)
    this.router.use(
      '/passengers',
      OnlyAdmin,
      Routing.create<Passenger>(Passenger)
    )
    this.router.use(
      '/claimables',
      OnlyAdmin,
      Routing.create<Claimable>(Claimable)
    )
    this.router.use(
      '/user-claims',
      OnlyAdmin,
      Routing.create<UserClaim>(UserClaim)
    )
    this.router.use('/bookings', OnlyAdmin, BookingCustomRoutes)
    this.router.use('/bookings', OnlyAdmin, Routing.create<Booking>(Booking))
    this.router.use('/trips', OnlyAdmin, TripCustomRoutes)
    this.router.use('/trips', OnlyAdmin, Routing.create<Trip>(Trip))
    this.router.use('/user', UserCustomRoutes)
    this.router.use('/import', ImportCustomRoutes)
    this.router.use('/import', OnlyAdmin, Routing.create<Import>(Import))

    this.router.use(
      '/reports',
      AllowList(['Amazon-Admin', 'Admin']),
      ReportRoutes
    )
  }
}

export default new Version1Route().router
