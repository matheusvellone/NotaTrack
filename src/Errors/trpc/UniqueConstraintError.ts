import BaseError from './BaseError'
import { uniqueConstraint } from './errorCodes'

export default class UniqueConstraintError extends BaseError {
  constructor(code: keyof typeof uniqueConstraint) {
    super('BAD_REQUEST', uniqueConstraint[code])
  }
}
