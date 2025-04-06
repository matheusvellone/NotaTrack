import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const {
  DATABASE_URL,
} = process.env

const db = drizzle({
  schema,
  casing: 'snake_case',
  connection: {
    connectionString: DATABASE_URL,
  },
})

export default db
