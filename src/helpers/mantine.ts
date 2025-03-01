import { UseFormReturnType } from '@mantine/form'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormOnSubmit<F extends UseFormReturnType<T>, T = any> = Parameters<F['onSubmit']>[0]
