import bcrypt from 'bcryptjs'

export const hash = (value: string): string => {
  const salt = bcrypt.genSaltSync(10)

  return bcrypt.hashSync(value, salt)
}

export const compare = (rawString: string, hashedString: string): boolean => {
  return bcrypt.compareSync(rawString, hashedString)
}
