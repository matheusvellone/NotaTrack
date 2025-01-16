import axios from 'axios'
import { DateTime } from 'luxon'
import { Query } from './types'
import { ProductUnit } from '@prisma/client'

const { INFOSIMPLES_API_KEY } = process.env

const infosimplesClient = axios.create({
  baseURL: 'https://api.infosimples.com',
})

type Produto = {
  codigo: string
  descricao: string
  unidade: string
  qtd: number
  normalizado_valor: number
  valor_unitario_comercial: string
  tributos: string
}

type ConsultaNFCEResult = {
  emitente: {
    nome: string
    cnpj: string
  }
  nfe: {
    data_emissao: string
  }
  produtos: Produto[]
}

const convertProductUnit = (unit: string) => {
  switch (unit) {
    case 'UN':
      return ProductUnit.UN
    case 'KG':
      return ProductUnit.KG
    case 'L':
      return ProductUnit.L
    default:
      throw new Error(`Unknown unit: ${unit}`)
  }
}

export const query: Query = async (chaveAcessoNFCe) => {
  if (!INFOSIMPLES_API_KEY) {
    throw new Error('INFOSIMPLES_API_KEY is not defined')
  }

  const response = await infosimplesClient.get<ConsultaNFCEResult>('/api/v2/consultas/sefaz/sp/nfce', {
    params: {
      token: INFOSIMPLES_API_KEY,
      timeout: 600,
      ignore_site_receipt: 0,
      nfce: chaveAcessoNFCe,
    },
  })

  return {
    accessKey: chaveAcessoNFCe,
    storeCNPJ: response.data.emitente.cnpj,
    storeName: response.data.emitente.nome,
    emittedAt: DateTime.fromFormat(response.data.nfe.data_emissao, 'dd/MM/yyyy HH:mm:ssZZ').toJSDate(),
    products: response.data.produtos.map((produto) => ({
      code: produto.codigo,
      name: produto.descricao,
      unit: convertProductUnit(produto.unidade),
      quantity: produto.qtd,
      value: produto.normalizado_valor,
      taxValue: Number(produto.tributos.replace(',', '.')) * 100,
      unitComercialValue: Number(produto.valor_unitario_comercial.replace(',', '.')) * 100,
    })),
  }
}
