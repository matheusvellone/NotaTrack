import BaseError from './BaseError'
import { notFound } from './errorCodes'

export default class NotFoundError extends BaseError {
  constructor(resourceName: keyof typeof notFound) {
    super('NOT_FOUND', notFound[resourceName])
  }
}
