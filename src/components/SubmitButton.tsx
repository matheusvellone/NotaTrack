import { Button, Flex } from '@mantine/core'

type SubmitButtonProps = {
  label: string
  form: {
    submitting: boolean
  }
}

const SubmitButton = ({
  label,
  form,
}: SubmitButtonProps) => {
  return (
    <Flex
      direction='column'
      align={{ base: 'stretch', sm: 'flex-end' }}
    >
      <Button loading={form.submitting} type='submit'>
        {label}
      </Button>
    </Flex>
  )
}

export default SubmitButton
