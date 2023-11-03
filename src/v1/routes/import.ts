import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode } from '@app/middleware'
import multer from 'multer'
import { parse } from '@fast-csv/parse'
import { findUserByEmail } from '@app/repository/user'
import {
  acceptBatch,
  addBookingImport,
  clearBookingImports,
  createNewImport,
  getAll,
  getBookingImportFailures,
  resetImportStatuses,
  updateBatch
} from '@app/repository/import'
import { findLocationByNames } from '@app/repository/location'
import { ImportStatus } from '@app/enums/import'

const upload = multer()

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAll()

    return res.status(200).json({
      data
    })
  } catch (error) {
    next({ name: ErrorCode.CannotReturnData })
  }
})

router.get(
  '/failures',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getBookingImportFailures()

      return res.status(200).json({
        data
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/abort/:id',
  upload.single('csv'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      await clearBookingImports()

      updateBatch({
        id,
        status: ImportStatus.CANCELLED
      })
      return res.status(200).json({
        message: 'Successfully accepted csv file'
      })
    } catch (error) {
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/accept/:id',
  upload.single('csv'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await acceptBatch(req.params.id)

      await clearBookingImports()
      await resetImportStatuses()

      return res.status(200).json({
        message: 'Successfully accepted csv file'
      })
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

router.post(
  '/csv',
  upload.single('csv'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const batch = await createNewImport()
      let errors = 0
      let rowCount = 0
      let totalRowCount = 0
      await clearBookingImports()
      await resetImportStatuses()

      const stream = parse({ headers: true })
        .on('error', (error) => {
          console.log('import csv error')
          console.error(error)
        })
        .on('data', async (row: any) => {
          rowCount++
          const user = await findUserByEmail(row.email)
          const location = await findLocationByNames(row.location, row.zone)
          let comment = ''
          let status = ImportStatus.INPROGRESS

          if (rowCount === totalRowCount) {
            status = ImportStatus.PENDING_CONFIRM
          }

          if (!user) {
            comment = `User ${row.email} does not exist`
          }

          if (!location) {
            comment += `, Location ${row.zone} - ${row.location} does not exist`
          }

          if (comment !== '') {
            errors++
          }

          await addBookingImport({
            batch,
            date: row.date,
            passenger: user,
            location,
            canImport: comment === '',
            comment
          })
          await updateBatch({
            id: batch.id,
            failed: errors,
            status
          })
        })
        .on('end', async (total: number) => {
          totalRowCount = total
          await updateBatch({
            id: batch.id,
            total
          })
          console.log(`Parsed ${total} rows`)
        })

      stream.write(req.file.buffer)
      stream.end()

      return res.status(200).json(batch)
    } catch (error) {
      console.log(error)
      next({ name: ErrorCode.CannotReturnData })
    }
  }
)

export default router
