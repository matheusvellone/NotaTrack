import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const {
  DATABASE_URL,
} = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const db = drizzle({
  schema,
  casing: 'snake_case',
  connection: {
    connectionString: DATABASE_URL,
  },
})

export default db
