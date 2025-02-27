import nextPlugin from '@next/eslint-plugin-next'
import config from '@vellone/techsak/eslint.config.mjs'

const eslintConfig = [
  {
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    }
  },
  ...config,
]

export default eslintConfig
