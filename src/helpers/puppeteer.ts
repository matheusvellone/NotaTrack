import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import UserAgent from 'user-agents'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { isProduction } from '~/helpers/env'
import { Promise } from 'bluebird'
import type { Browser, Page } from 'puppeteer'
import logger from './logger'

import 'puppeteer-extra-plugin-stealth/evasions/chrome.app'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.csi'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.runtime'
import 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow'
import 'puppeteer-extra-plugin-stealth/evasions/media.codecs'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.languages'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver'
import 'puppeteer-extra-plugin-stealth/evasions/sourceurl'
import 'puppeteer-extra-plugin-stealth/evasions/user-agent-override'
import 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions'
import 'puppeteer-extra-plugin-stealth/evasions/defaultArgs'

const {
  TWO_CAPTCHA_API_KEY,
} = process.env

puppeteer.use(StealthPlugin())

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: '2captcha', token: TWO_CAPTCHA_API_KEY },
    visualFeedback: true,
  })
)

const globalForPuppeteer = globalThis as unknown as {
  puppeteerBrowser?: Browser
}

const browserSingleton = async () => {
  const globalBrowser = globalForPuppeteer.puppeteerBrowser

  if (globalBrowser) {
    if (globalBrowser.connected) {
      return globalBrowser
    }

    await globalBrowser.close()
  }

  const {
    PUPPETEER_BROWSER_ENDPOINT,
    PUPPETEER_WS_ENDPOINT,
  } = process.env

  if (PUPPETEER_BROWSER_ENDPOINT || PUPPETEER_WS_ENDPOINT) {
    logger.debug({
      browserEndpoint: PUPPETEER_BROWSER_ENDPOINT,
      browserWsEndpoint: PUPPETEER_WS_ENDPOINT,
    }, 'Connecting to existing browser')

    const newBrowser = await puppeteer.connect({
      browserURL: PUPPETEER_BROWSER_ENDPOINT,
      browserWSEndpoint: PUPPETEER_WS_ENDPOINT,
      acceptInsecureCerts: true,
      defaultViewport: null,
    })

    logger.debug('Connected to browser')

    globalForPuppeteer.puppeteerBrowser = newBrowser
    return newBrowser
  }

  logger.debug('Launching new browser')
  const newBrowser = await puppeteer.launch({
    acceptInsecureCerts: true,
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  })
  logger.debug('Launched new browser')

  globalForPuppeteer.puppeteerBrowser = newBrowser
  return newBrowser
}

export const openPage = async (url: string) => {
  const browser = await browserSingleton()
  const page = await browser.newPage()

  try {
    const userAgent = new UserAgent(/Windows/)
    await page.setUserAgent(userAgent.toString())

    await page.goto(url, { waitUntil: 'networkidle0' })

    return page
  } catch (error) {
    await page.close()

    throw error
  }
}

const isCaptchaSolved = () => {
  // @ts-expect-error Tipagem do browser
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const recaptchaResponse = globalThis.grecaptcha.getResponse() as string
  return recaptchaResponse.length > 0
}

export const solveCaptcha = async (page: Page, parentCaptchaSelector: string) => {
  const captchaIframeElement = await page.waitForSelector(`${parentCaptchaSelector} iframe`)
  const captchaIframe = await captchaIframeElement?.contentFrame()

  if (!captchaIframe) {
    throw new Error('Captcha iframe not found')
  }

  const anchorElement = await captchaIframe.$('#recaptcha-anchor')

  if (!anchorElement) {
    throw new Error('Captcha anchor element not found')
  }

  const {
    height = 28,
    width = 28,
  } = await anchorElement.boundingBox() || {}

  await anchorElement.click({
    offset: {
      x: Math.random() * width,
      y: Math.random() * height,
    },
  })

  const captchaSolved = await page.evaluate(isCaptchaSolved)

  if (!captchaSolved && TWO_CAPTCHA_API_KEY) {
    await page.solveRecaptchas()
  }

  await page.waitForFunction(isCaptchaSolved, {
    polling: 100,
    timeout: isProduction ? undefined : 0,
  })

  await Promise.delay(500)
}
