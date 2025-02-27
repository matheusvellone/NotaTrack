import { isLocal } from '~/helpers/env'
import { Query } from './types'

export const query: Query = (chaveAcesso) => {
  if (!isLocal) {
    throw new Error('development provider is only available in local environment')
  }

  return {
    accessKey: chaveAcesso,
    storeCNPJ: '51.272.474/0002-04',
    storeName: 'Comercial Ikeda Ltda',
    emissionDate: new Date('2021-08-25T14:00:00Z'),
    products: [
      {
        name: 'Pao Ikeda Pao France',
        unit: 'KG',
        quantity: 0.38,
        storeCode: '166723',
        ean: null,
        price: 528,
        taxValue: 37,
        unitPrice: 139,
      },
      {
        name: 'Fgo File Peito Kg Re',
        unit: 'KG',
        quantity: 0.838,
        storeCode: '2629',
        ean: null,
        price: 2529,
        taxValue: 114,
        unitPrice: 3019,
      },
      {
        name: 'Leit f Frutap 850g B',
        unit: 'UN',
        quantity: 1,
        storeCode: '135950',
        ean: '7896862002060',
        price: 1099,
        taxValue: 46,
        unitPrice: 1099,
      },
    ],
  }
}
