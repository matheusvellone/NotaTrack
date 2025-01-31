import config from '@vellone/techsak/eslint.config.mjs'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
  }),
  ...config,
]

export default eslintConfig
