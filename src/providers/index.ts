import * as notaFiscalPaulista from './nfp'
import * as infosimples from './infosimples'
import * as development from './development'
import * as rawProvider from './raw'

const providers = {
  development,
  infosimples,
  notaFiscalPaulista,
  raw: rawProvider,
}

export default providers
