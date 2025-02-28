import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import userAgent from 'user-agents'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { isProduction } from '~/helpers/env'
import { UFData } from './types'
import { InvoiceAccessKey } from '~/helpers/types'
import { Promise } from 'bluebird'

const {
  TWO_CAPTCHA_API_KEY,
} = process.env

puppeteer.use(StealthPlugin())

const automaticCaptchaSolving = isProduction && !!TWO_CAPTCHA_API_KEY

if (automaticCaptchaSolving) {
  puppeteer.use(
    RecaptchaPlugin({
      provider: { id: '2captcha', token: TWO_CAPTCHA_API_KEY },
      visualFeedback: true,
    }),
  )
}

const openInvoice = async (invoiceAccessKey: InvoiceAccessKey, info: UFData) => {
  const browser = await puppeteer.launch({
    acceptInsecureCerts: true,
    headless: !automaticCaptchaSolving,
    timeout: 0,
  })
  const page = await browser.newPage()

  await page.setUserAgent(userAgent.random().toString())
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
        req.abort()
      } else {
        req.continue()
      }
    })
  }

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    })
  })

  await page.evaluateOnNewDocument(() => {
    globalThis.chrome = {
      runtime: {},
    }
  })

  await page.evaluateOnNewDocument(() => {
    const originalQuery = globalThis.navigator.permissions.query
    return globalThis.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    )
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', {
      // This just needs to have `length > 0` for the current test,
      // but we could mock the plugins too if necessary.
      get: () => [1, 2, 3, 4, 5],
    })
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'languages', {
      get: () => ['pt-BR', 'pt'],
    })
  })

  await page.goto(info.url, {
    waitUntil: 'networkidle0',
    timeout: 0,
  })

  await page.locator(info.codeInputSelector).click()
  await Promise.delay(1000)
  await page.locator(info.codeInputSelector).fill(invoiceAccessKey)

  if (automaticCaptchaSolving) {
    await page.solveRecaptchas()
    await page.locator(info.confirmSelector).click()
  }

  await page.waitForNavigation({ timeout: 0 })

  return { page, browser }
}

export default openInvoice
