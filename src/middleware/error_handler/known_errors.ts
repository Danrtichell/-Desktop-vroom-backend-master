export enum ErrorCode {
  // begin JWT-defined errors. Do not change values
  TokenExpiredError = 'TokenExpiredError',
  JsonWebTokenError = 'JsonWebTokenError',
  // end JWT-defined errors

  // begin app errors
  ValidationError = 'ValidationError',
  CannotCreate = 'CannotCreate',
  CannotDelete = 'CannotDelete',
  CannotUpdate = 'CannotUpdate',
  CannotReturnData = 'CannotReturnData',
  Unauthenticated = 'Unauthenticated',
  InvalidToken = 'InvalidToken',
  InvalidCredentials = 'InvalidCredentials',
  TokenMissing = 'TokenMissing',
  UntrustedApp = 'UntrustedApp',
  DuplicateEmail = 'DuplicateEmail',
  NotEligibleEmail = 'NotEligibleEmail',
  ResourceNotFound = 'ResourceNotFound',
  ServiceUnavailable = 'ServiceUnavailable'
}

export enum HttpCode {
  Success = 200, // for updates and generic use
  Created = 201,
  Accepted = 202, // for use when processing is backgrounded
  Deleted = 204, // a.k.a. No Content
  BadRequest = 400,
  Unauthenticated = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnsupportedMediaType = 415,
  Unprocessable = 422,
  InternalServerError = 500,
  ServiceUnavailable = 503
}

// the statusCode property is used only by res.status and will not be part of the actual response payload
// if adding a new error, please add an entry in ErrorCode as well.
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KnownErrors: any = {
  ValidationError:    { statusCode: HttpCode.BadRequest,          code: 'ERROR_400', message: 'Validation Error' },
  CannotCreate:       { statusCode: HttpCode.Unprocessable,       code: 'ERROR_422', message: 'Unable to Create' },
  CannotDelete:       { statusCode: HttpCode.Unprocessable,       code: 'ERROR_422', message: 'Unable to Delete Field or Record' },
  CannotReturnData:   { statusCode: HttpCode.NotFound,            code: 'ERROR_404', message: 'Unable to Return Data' },
  ResourceNotFound:   { statusCode: HttpCode.NotFound,            code: 'ERROR_404', message: 'Resource Not Found' },
  NotEligibleEmail:   { statusCode: HttpCode.NotFound,            code: 'ERROR_404', message: 'Email is not eligible.' },
  CannotUpdate:       { statusCode: HttpCode.Unprocessable,       code: 'ERROR_422', message: 'Unable to Update' },
  Unauthenticated:    { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Invalid Token!' },
  TokenExpiredError:  { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Token has Expired!' },
  JsonWebTokenError:  { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Token is malformed or has wrong signature.' },
  InvalidToken:       { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Token is invalid.' },
  InvalidCredentials: { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Credentials are invalid.' },
  TokenMissing:       { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_401', message: 'Token is missing.' },
  UntrustedApp:       { statusCode: HttpCode.Unauthenticated,     code: 'ERROR_422', message: 'Untrusted App.' },
  DuplicateEmail:     { statusCode: HttpCode.Conflict,            code: 'ERROR_409', message: 'Email already in use.' },
  ServiceUnavailable: { statusCode: HttpCode.ServiceUnavailable,  code: 'ERROR_503', message: 'Something went wrong.' }
};
