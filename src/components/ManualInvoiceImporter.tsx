import { ActionIcon, Stack } from '@mantine/core'
import AccessKeyInput from './AccessKeyInput'
import { useForm } from '@mantine/form'
import { InvoiceAccessKey } from '~/helpers/types'
import { trpc } from '~/helpers/trpc'
import SubmitButton from './SubmitButton'
import { IconCamera } from '@tabler/icons-react'
import { useState } from 'react'
import QrCodeScanner from './QrCodeScanner'

type Form = {
  nfceAccessKey: InvoiceAccessKey | null
}

const ManualInvoiceImporter = () => {
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

  const handleSubmit = async (values: typeof form.values) => {
    await processInvoice.mutateAsync({
      nfceAccessKey: values.nfceAccessKey,
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <AccessKeyInput
          style={{ flexGrow: 1 }}
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
                form.setFieldValue('nfceAccessKey', qrCodeData)
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

export default trpc.withTRPC(ManualInvoiceImporter)
