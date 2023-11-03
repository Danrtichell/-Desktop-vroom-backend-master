/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { KnownErrors } from './known_errors'
export { ErrorCode, HttpCode } from './known_errors'

const ErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any> => {
  console.error(
    `Error when requesting ${req.method} ${req.originalUrl}`,
    error,
    error.stack
  )

  if (res.headersSent) next(error) // something beyond our control happpened. let Express handle the rest.

  // Some packages/routines throw errors that are just strings. This condition is for handling this scenario.
  if (typeof error === 'string')
    return res.status(400).json({ error: { message: error } })

  const { name, message, details, context, validationError } = error

  const derivedError = KnownErrors[name]
    ? KnownErrors[name]
    : KnownErrors.ServiceUnavailable
  derivedError.name = name // include invoked error as type for convenient investigation and debugging
  derivedError.path = req.path
  if (message) derivedError.message = message // allow error thrower to override the message
  if (context) derivedError.context = context // allow error thrower to include more context to aid consumer, e.g., Events, Sessions, etc
  if (validationError) derivedError.validationError = validationError
  if (details && process.env.FLAVOR === 'local') derivedError.details = details // allow error thrower to include actual caught errors

  const httpStatusCode = derivedError.statusCode

  return res.status(httpStatusCode || 500).send({ error: derivedError })
}

export { ErrorHandler, KnownErrors }
