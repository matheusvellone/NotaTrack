import { Text, TextProps } from '@mantine/core'
import { DateInput, convertToDateTime } from '~/helpers/date'

type Props = {
  date: DateInput
  textProps?: TextProps
  format?: string
} & Intl.DateTimeFormatOptions

const Date = ({
  date,
  textProps = {},
  format,
  ...dateTimeFormatOptions
}: Props) => {
  const dateObject = convertToDateTime(date)
  const dateString = format ? dateObject.toFormat(format) : dateObject.toLocaleString(dateTimeFormatOptions)

  return (
    <Text {...textProps}>{dateString}</Text>
  )
}

export default Date
