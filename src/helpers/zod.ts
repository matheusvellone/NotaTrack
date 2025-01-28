import { z, ZodType } from 'zod'

export const buildModelIdSchema = <Model extends { id: number }>() => {
  return z.number().min(1) as ZodType<Model['id']>
}
