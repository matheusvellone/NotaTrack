import { Badge } from '@mantine/core'
import { InvoiceStatus } from '@prisma/client'

type Props = {
  status: InvoiceStatus
}

const InvoiceStatusBadge = ({ status }: Props) => {
  if (status === InvoiceStatus.PROCESSED) {
    return (
      <Badge color='green'>Processed</Badge>
    )
  }

  if (status === InvoiceStatus.ERROR) {
    return (
      <Badge color='red'>Error</Badge>
    )
  }

  return (
    <Badge color='gray'>Pending</Badge>
  )
}

export default InvoiceStatusBadge
