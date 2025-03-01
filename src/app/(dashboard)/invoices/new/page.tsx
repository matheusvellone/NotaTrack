'use client'

import { Button, Group } from '@mantine/core'
import { modals } from '@mantine/modals'
import InvoiceImporter from '~/components/InvoiceImporter'
import ManualInvoiceImporter from '~/components/ManualInvoiceImporter'

const NewInvoice = () => {
  const openImportModal = () => {
    const modalId = modals.open({
      title: 'Importar notas fiscais',
      children: (
        <InvoiceImporter
          onImport={() => {
            modals.close(modalId)
          }}
        />
      ),
    })
  }

  const openManualAddModal = () => {
    const modalId = modals.open({
      title: 'Adicionar nota fiscal manualmente',
      children: (
        <ManualInvoiceImporter
          onImport={() => {
            modals.close(modalId)
          }}
        />
      ),
    })
  }

  return (
    <Group>
      <Button onClick={openImportModal}>
        Importar notas fiscais automaticamente
      </Button>

      <Button onClick={openManualAddModal}>
        Adicionar nota fiscal manualmente
      </Button>
    </Group>
  )
}

export default NewInvoice
