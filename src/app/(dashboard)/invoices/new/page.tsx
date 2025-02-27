'use client'

import { Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import MaskedInput from '~/components/MaskedInput'
import SubmitButton from '~/components/SubmitButton'
import { trpc } from '~/helpers/trpc'

const NewInvoice = () => {
  const form = useForm({
    initialValues: {
      nfceAccessKey: '',
    },
  })
  const processInvoice = trpc.invoice.process.useMutation({
    trpc: {
      context: {
        form,
        notificate: {
          error: 'Failed to create invoice',
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
        <MaskedInput
          label='NFC-e Access Key'
          mask='0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000'
          {...form.getInputProps('nfceAccessKey')}
        />
        <SubmitButton form={form} label='Create'/>
      </Stack>
    </form>
  )
}

export default NewInvoice
