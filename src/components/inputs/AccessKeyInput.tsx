import { NFE_MASK } from '~/constants/masks'
import MaskedInput, { MaskedInputProps } from './MaskedInput'

type Props = Omit<MaskedInputProps, 'label' | 'mask' | 'unmask'>

const AccessKeyInput = (props: Props) => {
  return (
    <MaskedInput
      label='Chave de acesso da nota fiscal'
      unmask
      mask={[NFE_MASK]}
      {...props}
    />
  )
}

export default AccessKeyInput
