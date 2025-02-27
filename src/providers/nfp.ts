import { Query } from './types'
import { login } from '~/clients/nfp'

const URL_CONSULTA = 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaPublica.aspx'

export const query: Query = async (chaveAcesso) => {
  await login()

  return {
    accessKey: Math.random().toString(),
    emissionDate: new Date('2021-08-25T14:00:00Z'),
    storeCNPJ: '00.000.000/0001-99',
    storeName: 'Teste',
    products: [],
  }
}

export const importAllFromCPF = async () => {
  await login()

  return []
}
