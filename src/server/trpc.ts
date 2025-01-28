import { TRPCError, initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc'
import BaseError from '~/Errors/trpc/BaseError'
import InternalError from '~/Errors/trpc/InternalError'
import { errorMessages } from '~/Errors/trpc/errorCodes'
import ValidationError from '~/Errors/trpc/ValidationError'
import NotFoundError from '~/Errors/trpc/NotFoundError'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import UniqueConstraintError, { isValidUniqueConstraintCode } from '~/Errors/trpc/UniqueConstraintError'
import { isModelName, isUniqueConstraintError } from '~/helpers/prisma'

const dealWithPrismaError = (error: PrismaClientKnownRequestError) => {
  if (error.code === 'P2025') {
    const modelMatch = error.message.match(/No (.*) found/)
    if (!modelMatch) {
      return
    }

    const [, modelName] = modelMatch
    if (modelName && isModelName(modelName)) {
      return new NotFoundError(`model.${modelName}`)
    }
  }

  if (isUniqueConstraintError(error)) {
    type Meta = {
      modelName: string
      target: string[]
    }
    const meta = error.meta as undefined | Meta
    const {
      modelName,
      target,
    } = meta || {}

    const code = `${modelName}.${target?.join('.')}`

    if (!isValidUniqueConstraintCode(code)) {
      return
    }

    return new UniqueConstraintError(code)
  }

  return
}

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

  if (error.cause instanceof PrismaClientKnownRequestError) {
    const newError = dealWithPrismaError(error.cause)

    if (newError) {
      return newError
    }
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
