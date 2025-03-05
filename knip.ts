import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  include: [
    'nsExports',
    'nsTypes',
  ],
  ignoreDependencies: [
    'prisma-dbml-generator',
  ],
}

export default config
