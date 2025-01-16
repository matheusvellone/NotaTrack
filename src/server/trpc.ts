import { TRPCError, initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc'
import BaseError from '~/Errors/trpc/BaseError'
import InternalError from '~/Errors/trpc/InternalError'
import { errorMessages } from '~/Errors/trpc/errorCodes'
import ValidationError from '~/Errors/trpc/ValidationError'
import NotFoundError from '~/Errors/trpc/NotFoundError'

const normalizeError = (error: TRPCError) => {
  if (error instanceof BaseError) {
    return error
  }

  if (error.cause instanceof ZodError) {
    return new ValidationError(error.cause)
  }

  if (error.code === 'NOT_FOUND') {
    return new NotFoundError('path')
  }

  return new InternalError(error)
}

const t = initTRPC
  .create({
    errorFormatter: ({ error, shape }) => {
      const normalizedError = normalizeError(error)

      return {
        ...shape,
        message: errorMessages[normalizedError.data.errorCode],
        code: TRPC_ERROR_CODES_BY_KEY[normalizedError.code],
        data: normalizedError.data,
      }
    },
  })

export const router = t.router

export const publicProcedure = t.procedure
