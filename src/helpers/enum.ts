// Helper functions for enums

export const isValidEnumValue = <T extends Record<string, unknown>>(value: unknown, enumObject: T): value is T[keyof T] => {
  return Object.values(enumObject).includes(value)
}

export const isValidKeyValue = <T extends Record<string, unknown>>(value: unknown, object: T): value is keyof T => {
  if (typeof value !== 'string') {
    return false
  }
  return Object.keys(object).includes(value)
}
