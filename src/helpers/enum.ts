// Helper functions for enums

export const getEnumValues = <T extends Record<string, unknown>>(myEnum: T) => {
  return Object.values(myEnum) as [T[keyof T], ...Array<T[keyof T]>]
}

export const isValidEnumValue = <T extends Record<string, unknown>>(value: unknown, enumObject: T): value is T[keyof T] => {
  return Object.values(enumObject).includes(value)
}
