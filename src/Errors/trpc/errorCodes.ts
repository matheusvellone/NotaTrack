export const internal = '1'

export const application = {
} as const

export const notFound = {
  path: '1100',
} as const

export const invalid = {
  input: '1300',
} as const

export const unauthorized = {
} as const

export const uniqueConstraint = {
} as const

export const errorCode = {
  internal,
  application,
  notFound,
  invalid,
  unauthorized,
  uniqueConstraint,
}

export type ErrorCode =
  | typeof internal
  | typeof application[keyof typeof application]
  | typeof notFound[keyof typeof notFound]
  | typeof invalid[keyof typeof invalid]
  | typeof unauthorized[keyof typeof unauthorized]
  | typeof uniqueConstraint[keyof typeof uniqueConstraint]

export const errorMessages: Record<ErrorCode, string> = {
  1: 'Erro interno',

  1100: 'Recurso não encontrado',

  1300: 'Erro de validação',
}
