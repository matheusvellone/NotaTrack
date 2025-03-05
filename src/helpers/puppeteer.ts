import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import UserAgent from 'user-agents'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { isProduction } from '~/helpers/env'
import { Page } from 'puppeteer'
import { Promise } from 'bluebird'

const {
  TWO_CAPTCHA_API_KEY,
} = process.env

puppeteer.use(StealthPlugin())

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: '2captcha', token: TWO_CAPTCHA_API_KEY },
    visualFeedback: true,
  }),
)

export const openPage = async (url: string) => {
  const browser = await puppeteer.launch({
    acceptInsecureCerts: true,
    headless: isProduction,
    timeout: 0,
  })
  const page = await browser.newPage()

  const userAgent = new UserAgent(/Windows/)
  await page.setUserAgent(userAgent.toString())
  await page.setViewport({
    width: 1600 + Math.floor(Math.random() * 200 - 100),
    height: 900 + Math.floor(Math.random() * 200 - 100),
    isLandscape: false,
    isMobile: false,
  })

  if (isProduction) {
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
        void req.abort()
      } else {
        void req.continue()
      }
    })
  }

  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 0,
  })

  return { page, browser }
}

export const solveCaptcha = async (page: Page) => {
  const overQuota = await page.$('#rc-anchor-over-quota')

  if (overQuota) {
    await page.click('#recaptcha-anchor')
    await page.waitForNetworkIdle()
  }

  if (isProduction) {
    if (!TWO_CAPTCHA_API_KEY) {
      throw new Error('2Captcha API Key is required to solve captches')
    }

    await page.solveRecaptchas()
  }

  await page.waitForFunction(() => {
    // @ts-expect-error Tipagem do browser
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const recaptchaResponse = globalThis.grecaptcha.getResponse() as string
    return recaptchaResponse.length > 0
  }, {
    polling: 100,
    timeout: isProduction ? undefined : 0,
  })

  await Promise.delay(500)
}
