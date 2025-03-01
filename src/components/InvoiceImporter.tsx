'use client'

import { Button, Checkbox, Group, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { trpc } from '~/helpers/trpc'
import { UF } from '~/helpers/uf'
import UfSelector from './UfSelector'
import DocumentNumberInput from './DocumentNumberInput'
import { FormOnSubmit } from '~/helpers/mantine'
import { IMPORT_INVOICE_LOGIN_INFORMATION, ImportInvoiceLoginInformation } from '~/constants/localStorage'

type Form = {
  saveLoginInformation: boolean
  username: string
  password: string
  uf: UF | null
}

type Props = {
  onImport: () => void
}

const InvoiceImporter = ({
  onImport,
}: Props) => {
  const form = useForm<Form>({
    initialValues: {
      saveLoginInformation: true,
      username: '',
      password: '',
      uf: null,
    },
  })

  form.watch('uf', ({ value: uf }) => {
    if (!uf) {
      return
    }

    const existingData = localStorage.getItem(IMPORT_INVOICE_LOGIN_INFORMATION) || '{}'
    const data = JSON.parse(existingData) as ImportInvoiceLoginInformation

    if (data[uf]) {
      form.setFieldValue('username', data[uf].username)
      form.setFieldValue('password', data[uf].password)
    }
  })

  const importInvoice = trpc.invoice.loadAll.useMutation({
    trpc: {
      context: {
        notificate: {
          error: 'Failed to import invoices',
          success: 'Invoices imported successfully',
        },
      },
    },
  })

  const onSubmit: FormOnSubmit<typeof form> = async ({
    saveLoginInformation,
    uf,
    ...values
  }) => {
    if (!uf) {
      return
    }

    await importInvoice.mutateAsync({
      ...values, uf,
    })

    if (saveLoginInformation) {
      const existingData = localStorage.getItem(IMPORT_INVOICE_LOGIN_INFORMATION) || '{}'
      const data = JSON.parse(existingData) as ImportInvoiceLoginInformation

      data[uf] = {
        username: values.username,
        password: values.password,
      }

      localStorage.setItem(IMPORT_INVOICE_LOGIN_INFORMATION, JSON.stringify(data))
    }
    onImport()
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <UfSelector
          {...form.getInputProps('uf')}
          showOnly={['sp']}
          required
        />
        <Group grow>
          <DocumentNumberInput
            label='Documento'
            placeholder='CPF ou CNPJ'
            {...form.getInputProps('username')}
            required
          />
          <PasswordInput
            label='Senha'
            {...form.getInputProps('password')}
            required
          />
        </Group>
        <Checkbox
          label='Salvar informações de login'
          {...form.getInputProps('saveLoginInformation', { type: 'checkbox' })}
        />
        <Button type='submit' loading={importInvoice.isPending}>
          Importar
        </Button>
      </Stack>
    </form>
  )
}

export default trpc.withTRPC(InvoiceImporter)
