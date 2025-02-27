import * as cheerio from 'cheerio'
import openInvoice from './puppeteer'
import getUfData from './uf'
import { Query } from '../types'

export const query: Query = async (chaveAcessoNFCe) => {
  const ufData = getUfData(chaveAcessoNFCe)

  const { page, browser } = await openInvoice(chaveAcessoNFCe, ufData)

  const pageContent = await page.content()

  const $ = cheerio.load(pageContent)

  const result = await ufData.parseInvoice($)

  await browser.close()

  return result
}
