// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GIT_COMMIT_SHA?: string

    // Nota Fiscal Paulista
    NFP_USER?: string
    NFP_PASSWORD?: string

    // 2Captcha
    TWO_CAPTCHA_API_KEY?: string
  }
}
