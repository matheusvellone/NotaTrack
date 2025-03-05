import pino from 'pino'
import { debugEnabled } from './env'

const loggerOptions = {
  messageKey: 'message',
  errorKey: 'error',
  level: debugEnabled ? 'debug' : 'info',
  formatters: {
    level: (label) => ({
      level: label,
    }),
  },
} satisfies pino.LoggerOptions

const logger = pino(loggerOptions)

export default logger
