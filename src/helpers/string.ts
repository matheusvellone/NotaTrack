// Helper functions for strings

export const randomId = () => Math.random().toString(36).slice(2)

export const pluralize = (count: number, singular: string, plural = singular + 's') => {
  return count === 1 ? singular : plural
}
