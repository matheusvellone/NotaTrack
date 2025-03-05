import { ActionIcon, Stack } from '@mantine/core'
import AccessKeyInput from './inputs/AccessKeyInput'
import { useForm } from '@mantine/form'
import { InvoiceAccessKey } from '~/helpers/types'
import { trpc } from '~/helpers/trpc'
import SubmitButton from './SubmitButton'
import { IconCamera } from '@tabler/icons-react'
import { useState } from 'react'
import QrCodeScanner from './QrCodeScanner'
import { nfeAccessKeySchema } from '~/helpers/zod'
import logger from '~/helpers/logger'

type Form = {
  nfceAccessKey: InvoiceAccessKey | null
}

type Props = {
  onImport: () => void
}

const ManualInvoiceImporter = ({
  onImport,
}: Props) => {
  const [scanningQr, setScanningQr] = useState(false)
  const form = useForm<Form>({
    initialValues: {
      nfceAccessKey: null,
    },
  })

  const processInvoice = trpc.invoice.process.useMutation({
    trpc: {
      context: {
        form,
        notificate: {
          error: 'Falha ao criar nota fiscal',
        },
      },
    },
  })

  const handleSubmit = async ({ nfceAccessKey }: typeof form.values) => {
    if (!nfceAccessKey) {
      return
    }

    await processInvoice.mutateAsync({
      nfceAccessKey,
    })

    onImport()
  }

  const resolveQrCodeData = (qrData: string) => {
    logger.debug({ qrData }, 'QR Code Data')
    // Chave de Acesso (às vezes com prefixo 'CFe')
    // Data e Hora
    // Valor Total
    // CPF do Cliente (ou vazio)
    // Assinatura?
    const data = qrData.split('|')

    const accessKey = data[0]?.match(/\d{44}/)?.[0]
    logger.debug({ accessKey }, 'Access Key')

    return nfeAccessKeySchema.parse(accessKey)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <AccessKeyInput
          required
          {...form.getInputProps('nfceAccessKey')}
          rightSection={scanningQr ? null : (
            <ActionIcon
              onClick={() => setScanningQr(true)}
            >
              <IconCamera size='1rem'/>
            </ActionIcon>
          )}
        />
        {
          scanningQr ? (
            <QrCodeScanner
              onScan={(qrCodeData) => {
                form.setFieldValue('nfceAccessKey', resolveQrCodeData(qrCodeData))
                setScanningQr(false)
              }}
            />
          ) : null
        }
        <SubmitButton form={form} label='Cadastrar'/>
      </Stack>
    </form>
  )
}

export default ManualInvoiceImporter
