import BaseError from './BaseError'
import { invalid } from './errorCodes'

export default class InvalidError extends BaseError {
  constructor(resourceName: keyof typeof invalid) {
    super('BAD_REQUEST', invalid[resourceName])
  }
}
