import 'dotenv/config'
import { ConnectionOptions } from 'typeorm'
import { join } from 'path'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { DATABASE_URL, FLAVOR } = process.env

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: false,
  // logging: ['warn', 'error'],
  // logger: FLAVOR === 'prod' ? 'file' : 'debug',
  entities: [join(__dirname, '../entity/*.ts')],
  migrations: [join(__dirname, 'migrations/*.ts')],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/database/migrations'
  },
  ssl: true,
  extra: {
    rejectUnauthorized: false
  }
}

export = connectionOptions
