import { ZodError } from 'zod'
import InvalidError from './InvalidError'

export default class ValidationError extends InvalidError {
  constructor(zodError: ZodError) {
    super('input')

    this.data.validationErrors = zodError.issues
  }
}
