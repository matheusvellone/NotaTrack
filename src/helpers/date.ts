import { DateTime } from 'luxon'

export type DateInput = string | Date | DateTime

export const convertToDateTime = (date: DateInput) => {
  if (date instanceof DateTime) {
    return date
  }

  if (date instanceof Date) {
    return DateTime.fromJSDate(date)
  }

  return DateTime.fromISO(date)
}
