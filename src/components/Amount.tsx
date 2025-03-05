import { Text, TextProps } from '@mantine/core'
import { toCurrency } from '~/helpers/number'

type Props = {
  children: number
} & Omit<TextProps, 'children'>

const Amount = ({
  children,
  ...textProps
}: Props) => {
  return (
    <Text {...textProps}>
      {toCurrency(children)}
    </Text>
  )
}

export default Amount
