import { TRPCError } from '@trpc/server'
import logger from '~/helpers/logger'
import BaseError from './BaseError'
import { internal } from './errorCodes'

export default class InternalError extends BaseError {
  constructor(originalError: TRPCError) {
    super('INTERNAL_SERVER_ERROR', internal)

    logger.error(originalError)
  }
}
