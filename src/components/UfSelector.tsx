import { Select, SelectProps } from '@mantine/core'
import { allUfs, UF, ufLabels } from '~/helpers/uf'

type Props = Omit<SelectProps, 'label' | 'placeholder' | 'data'> & {
  showOnly?: UF[]
}

const UfSelector = ({
  showOnly = [],
  ...props
}: Props) => {
  const data = allUfs
    .filter((uf) => showOnly.length === 0 || showOnly.includes(uf))
    .map((uf) => ({
      value: uf,
      label: ufLabels[uf],
    }))

  return (
    <Select
      label='Estado'
      placeholder='Selecione o estado'
      data={data}
      {...props}
    />
  )
}

export default UfSelector
