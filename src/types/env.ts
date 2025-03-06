// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    DEBUG?: string
    NEXT_PUBLIC_DEBUG?: string

    NEXT_PUBLIC_GIT_COMMIT_SHA?: string

    PUPPETEER_WS_ENDPOINT?: string
    PUPPETEER_BROWSER_ENDPOINT?: string

    // 2Captcha
    TWO_CAPTCHA_API_KEY?: string
  }
}
