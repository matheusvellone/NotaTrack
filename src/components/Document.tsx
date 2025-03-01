import { Text, TextProps } from '@mantine/core'
import { formatDocumentNumber } from '~/helpers/string'
import { DocumentNumber } from '~/helpers/types'

type Props = {
  document: DocumentNumber
} & TextProps

const Document = ({
  document,
  ...props
}: Props) => {
  return (
    <Text {...props}>
      {formatDocumentNumber(document)}
    </Text>
  )
}

export default Document
