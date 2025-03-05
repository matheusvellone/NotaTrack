import { InputBase, InputBaseProps } from '@mantine/core'
import { IMaskInput, IMaskInputProps } from 'react-imask'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MaskedInputProps = InputBaseProps & IMaskInputProps<any>

const MaskedInput = ({
  onChange,
  unmask = true,
  ...props
}: MaskedInputProps) => {
  return (
    <InputBase
      component={IMaskInput}
      unmask={unmask}
      {...props}
      onAccept={(value) => {
        // @ts-expect-error TODO: precisa ajustar a tipagem
        onChange?.(value)
      }}
    />
  )
}

export default MaskedInput
