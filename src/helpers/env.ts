export const debugEnabled = process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true'

export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

export const SHORT_HASH_VERSION = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA?.slice(0, 8) || 'local'
