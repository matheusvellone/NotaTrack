import { TRPCError } from '@trpc/server'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc'
import { ErrorCode } from './errorCodes'
import { ZodIssue } from 'zod'

type Data = {
  errorCode: ErrorCode
  validationErrors?: ZodIssue[]
}

export default class BaseError extends TRPCError {
  public data: Data

  constructor(errorKey: TRPC_ERROR_CODE_KEY, errorCode: ErrorCode) {
    super({
      code: errorKey,
    })

    this.data = {
      errorCode,
    }
  }
}

BaseError.stackTraceLimit = Infinity
