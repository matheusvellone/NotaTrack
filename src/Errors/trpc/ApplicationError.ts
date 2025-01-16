import BaseError from './BaseError'
import { application } from './errorCodes'

export default class ApplicationError<T extends keyof typeof application> extends BaseError {
  constructor(error: T) {
    super('BAD_REQUEST', application[error])
  }
}
