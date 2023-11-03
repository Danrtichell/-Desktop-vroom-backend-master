import jwt, { Secret } from 'jsonwebtoken'
import { JWT_ALGORITHM } from '@app/constants'

const generateSignedToken = (
  expiresIn: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: expiresIn
  })
}

export default generateSignedToken
