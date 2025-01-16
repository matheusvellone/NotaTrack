import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { ChaveAcessoNFCe } from '~/helpers/types'
import {
  query as queryNotaFiscal,
} from '~/services/notaFiscal'

const nfceAccessKeySchema = z.custom<ChaveAcessoNFCe>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return value.match(/\d{44}/)
}, 'Chave de Acesso da NFCe inválida')

const querySchema = z.object({
  nfceAccessKey: nfceAccessKeySchema,
})

export const query = publicProcedure
  .input(querySchema)
  .mutation(({ input }) => {
    return queryNotaFiscal(input.nfceAccessKey)
  })
