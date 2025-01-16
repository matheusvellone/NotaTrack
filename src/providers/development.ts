import { isLocal } from '~/helpers/env'
import { Query } from './types'

export const query: Query = async (chaveAcesso) => {
  if (!isLocal) {
    throw new Error('development provider is only available in local environment')
  }

  return {
    accessKey: chaveAcesso,
    storeCNPJ: '51.272.474/0002-04',
    storeName: 'Comercial Ikeda Ltda',
    emittedAt: new Date('2021-08-25T14:00:00Z'),
    products: [
      {
        name: 'Pao Ikeda Pao France',
        unit: 'KG',
        quantity: 0.38,
        code: '166723',
        value: 528,
        taxValue: 37,
        unitComercialValue: 139,
      },
      {
        name: 'Fgo File Peito Kg Re',
        unit: 'KG',
        quantity: 0.838,
        code: '2629',
        value: 2529,
        taxValue: 114,
        unitComercialValue: 3019,
      },
      {
        name: 'Leit f Frutap 850g B',
        unit: 'UN',
        quantity: 1,
        code: '135950',
        value: 1099,
        taxValue: 46,
        unitComercialValue: 1099,
      },
    ],
  }
}
