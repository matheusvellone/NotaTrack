import BaseError from './BaseError'
import { unauthorized } from './errorCodes'

export default class UnauthorizedError extends BaseError {
  constructor(resourceName: keyof typeof unauthorized) {
    super('UNAUTHORIZED', unauthorized[resourceName])
  }
}
