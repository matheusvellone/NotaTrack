import { NFE_MASK } from '~/constants/masks'
import MaskedInput, { MaskedInputProps } from './MaskedInput'

type Props = Omit<MaskedInputProps, 'label' | 'mask' | 'unmask'>

const AccessKeyInput = (props: Props) => {
  return (
    <MaskedInput
      label='NFC-e Access Key'
      unmask
      mask={[NFE_MASK]}
      {...props}
    />
  )
}

export default AccessKeyInput
