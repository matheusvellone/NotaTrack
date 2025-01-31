export const isLocal = process.env.NODE_ENV !== 'production'
export const isTest = process.env.NODE_ENV === 'test'

export const isBrowser = typeof globalThis !== 'undefined'

export const SHORT_HASH_VERSION = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA?.slice(0, 8) || 'local'
