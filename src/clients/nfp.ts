import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import * as cheerio from 'cheerio'
import { solveRecaptchaV2 } from './2captcha'
import logger from '~/helpers/logger'

const BASE_URL = 'https://www.nfp.fazenda.sp.gov.br'
const URL_LOGIN = '/login.aspx'

const jar = new CookieJar()
const nfpClient = wrapper(axios.create({
  jar,
  baseURL: BASE_URL,
}))

const SESSION_COOKIE_NAME = 'ASP.NET_SessionId'

const {
  NFP_USER,
  NFP_PASSWORD,
} = process.env

const solveLoginFormCaptcha = (siteKey: string | undefined) => {
  if (!siteKey) {
    throw new Error('reCAPTCHA site key not found')
  }

  return solveRecaptchaV2(siteKey, BASE_URL + URL_LOGIN)
}

const getLoginFormValues = async () => {
  if (!NFP_USER || !NFP_PASSWORD) {
    throw new Error('NFP_USER and NFP_PASSWORD must be set')
  }

  const getLoginResponse = await axios.get<string>(URL_LOGIN)

  const $ = cheerio.load(getLoginResponse.data)

  const gRecaptchaSiteKey = $('.g-recaptcha').attr('data-sitekey')

  const captchaResponse = await solveLoginFormCaptcha(gRecaptchaSiteKey)

  const formValues = $.extract({
    __EVENTTARGET: {
      selector: '#__EVENTTARGET',
      value: 'value',
    },
    __EVENTARGUMENT: {
      selector: '#__EVENTARGUMENT',
      value: 'value',
    },
    __VIEWSTATE: {
      selector: '#__VIEWSTATE',
      value: 'value',
    },
    __VIEWSTATEGENERATOR: {
      selector: '#__VIEWSTATEGENERATOR',
      value: 'value',
    },
    __EVENTVALIDATION: {
      selector: '#__EVENTVALIDATION',
      value: 'value',
    },
    ctl00$hddIDDoacao: {
      selector: '#hddIDDoacao',
      value: '',
    },
    ctl00$ddlTipoUsuario: {
      selector: '#ddlTipoUsuario > option[selected=selected]',
      value: 'value',
    },
  })

  return {
    ...formValues,
    ctl00$ConteudoPagina$controleLogin$UserName: NFP_USER,
    ctl00$ConteudoPagina$controleLogin$Password: NFP_PASSWORD,
    'g-recaptcha-response': captchaResponse,
  }
}

const getSessionCookie = async () => {
  const cookies = await jar.getCookies(URL_LOGIN)

  console.log('all cookies', cookies)

  return cookies.find(cookie => cookie.key === SESSION_COOKIE_NAME)
}

export const login = async () => {
  const sessionCookie = await getSessionCookie()

  if (sessionCookie) {
    try {
      await nfpClient.get('https://www.nfp.fazenda.sp.gov.br/Inicio.aspx', {
        maxRedirects: 0,
      })

      logger.debug('Valid session cookie')
      return
    } catch {
      logger.debug('Invalid session cookie. Logging in again')
    }
  }

  const formData = await getLoginFormValues()

  try {
    const response = await nfpClient.post(URL_LOGIN, formData, { maxRedirects: 0 })

    console.log('try', response.headers)
    throw new Error('Login failed')
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error
    }

    console.log('catch', error.response?.headers)

    if (error.status !== 302) {
      throw error
    }

    const sessionCookie = await getSessionCookie()
    console.log(sessionCookie)
  }
  // console.log(response.data)
}
