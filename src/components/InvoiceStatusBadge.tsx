import { Badge } from '@mantine/core'
import { InvoiceStatus } from '@prisma/client'
import { assertNever } from '~/helpers/types'

type Props = {
  status: InvoiceStatus
}

const InvoiceStatusBadge = ({ status }: Props) => {
  if (status === InvoiceStatus.PROCESSED) {
    return (
      <Badge color='green'>Processado</Badge>
    )
  }

  if (status === InvoiceStatus.ERROR) {
    return (
      <Badge color='red'>Erro</Badge>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (status === InvoiceStatus.PENDING) {
    return (
      <Badge color='gray'>Pendente</Badge>
    )
  }

  return assertNever(status)
}

export default InvoiceStatusBadge
