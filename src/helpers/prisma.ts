import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export type ModelName = Prisma.ModelName

// TODO: `field` should be locked to be a valid field from `model`
export const isUniqueConstraintError = (error: unknown, model?: ModelName, field?: string): error is PrismaClientKnownRequestError => {
  if (!(error instanceof PrismaClientKnownRequestError)) {
    return false
  }

  if (error.code !== 'P2002') {
    return false
  }

  const { meta } = error

  if (model && meta?.modelName !== model) {
    return false
  }

  if (field) {
    if (!meta || !meta.target || !Array.isArray(meta.target) || !meta.target.includes(field)) {
      return false
    }

    return true
  }

  return true
}

export const isModelName = (name: string): name is ModelName => {
  return Object.keys(Prisma.ModelName).includes(name)
}
