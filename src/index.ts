import 'dotenv/config'
import 'module-alias/register'
import 'tsconfig-paths/register'
import server from '@app/server'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import ENTITIES from '@app/entity'

const { PORT = '', DATABASE_URL = '' } = process.env

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection', error)
  process.exit(1)
})

createConnection({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  entities: ENTITIES,
  ssl: true,
  extra: {
    rejectUnauthorized: false
  }
})
  .then(async (connection) => {
    console.log('Successfully connected to the database')

    server.listen(PORT, () => console.log(`Service running at ${PORT}.`))
  })
  .catch((error) => console.log(error))
