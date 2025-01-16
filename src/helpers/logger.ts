import pino from 'pino'

const loggerOptions = {
  messageKey: 'message',
  errorKey: 'error',
  level: 'trace',
  formatters: {
    level: (label) => ({
      level: label,
    }),
  },
} satisfies pino.LoggerOptions

const logger = pino(loggerOptions)

export default logger
