import { CNPJ_MASK, CPF_MASK } from '~/constants/masks'
import MaskedInput, { MaskedInputProps } from './MaskedInput'

// TODO: Adicionar props para apenas CPF ou CNPJ

type Props = Omit<MaskedInputProps, 'mask' | 'unmask'>

const DocumentNumberInput = (props: Props) => {
  return (
    <MaskedInput
      placeholder='CPF ou CNPJ'
      unmask
      mask={[CPF_MASK, CNPJ_MASK]}
      {...props}
    />
  )
}

export default DocumentNumberInput
