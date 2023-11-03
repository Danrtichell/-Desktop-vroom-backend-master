// import AWSXRay from 'aws-xray-sdk';
import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import routes from '@app/v1/routes/index'
import { ErrorHandler } from './middleware'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      // eslint-disable-next-line @typescript-eslint/member-delimiter-style
      user?: object | string | undefined
    }
  }
}

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.setConfig()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private setConfig() {
    // Middlewares
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }))

    this.app.use('/api', routes)

    this.app.use(ErrorHandler)
  }
}

export default new App().app
