import express, { NextFunction, Request, Response, Router } from 'express'
import { EntityTarget, getRepository } from 'typeorm'
import { ErrorCode } from '@app/middleware'

export default class Routing<T> {
  public router: Router
  private type: EntityTarget<T>

  constructor(entityType: EntityTarget<T>) {
    this.router = express.Router()
    this.setConfig()
    this.type = entityType
  }

  private setConfig(): void {
    this.router.get('/', this.getAll)
    this.router.get('/:id', this.getById)
    this.router.post('/', this.create)
    this.router.put('/:id', this.update)
    this.router.delete('/:id', this.delete)
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(this.type)

      const data = await repository.find()

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '' } = req.params
      const repository = getRepository(this.type)

      const [data] = await repository.findByIds([id])

      if (data === undefined) {
        next({ name: ErrorCode.ResourceNotFound })
      }

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(this.type)
      const entity = await repository.save(
        repository.create({
          ...req.body.data
        })
      )

      return res.status(200).json({
        data: {
          message: 'Successfully created',
          entity
        }
      })
    } catch (error) {
      next({ name: ErrorCode.CannotCreate })
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '' } = req.params
      const repository = getRepository(this.type)
      const [data] = await repository.findByIds([id])

      if (data === undefined) {
        return res.status(404).json({
          message: 'Not found'
        })
      }

      const entity = await repository.update(id, {
        ...req.body.data
      })

      return res.status(200).json({
        data: {
          message: 'Successfully updated',
          updated: entity.affected
        }
      })
    } catch (error) {
      next({ name: ErrorCode.CannotUpdate })
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id = '' } = req.params
      const repository = getRepository(this.type)
      const [data] = await repository.findByIds([id])

      if (data === undefined) {
        return res.status(404).json({
          message: 'Not found'
        })
      }

      const entity = await repository.delete(id)

      return res.status(200).json({
        data: {
          message: 'Successfully deleted',
          deleted: entity.affected
        }
      })
    } catch (error) {
      next({ name: ErrorCode.CannotDelete })
    }
  }

  public static create<T>(type: EntityTarget<T>) {
    return new Routing<T>(type).router
  }
}
