export const internal = '1'

export const application = {} as const

export const invalid = {
  input: '1100',
} as const

export const notFound = {
  path: '1200',

  'model.Invoice': '1201',
  'model.Store': '1202',
  'model.InvoiceProduct': '1203',
  'model.Product': '1204',
  'model.StoreProduct': '1205',
} as const

export const uniqueConstraint = {
  'Invoice.access_key': '1300',
} as const

export const errorCode = {
  internal,
  application,
  notFound,
  invalid,
  uniqueConstraint,
}

export type ErrorCode =
  | typeof internal
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | typeof application[keyof typeof application]
  | typeof notFound[keyof typeof notFound]
  | typeof invalid[keyof typeof invalid]
  | typeof uniqueConstraint[keyof typeof uniqueConstraint]

export const errorMessages: Record<ErrorCode, string> = {
  1: 'Internal Server Error',

  1100: 'Validation error',

  1200: 'Not found',
  1201: 'Invoice not found',
  1202: 'Store not found',
  1203: 'InvoiceProduct not found',
  1204: 'Product not found',
  1205: 'StoreProduct not found',

  1300: 'Duplicate access key',
}
