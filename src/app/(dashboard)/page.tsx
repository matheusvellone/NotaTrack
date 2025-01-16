'use client'

import { TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { trpc } from '~/helpers/trpc'

export default function Home() {
  const form = useForm({
    initialValues: {
      chave: '',
    },
  })
  const queryNFCe = trpc.nfce.query.useMutation()

  const handleSubmit = async (values: typeof form.values) => {
    await queryNFCe.mutateAsync({
      nfceAccessKey: values.chave,
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label='Chave de Acesso NFC-e'
        {...form.getInputProps('chave')}
      />
    </form>
  )
}
