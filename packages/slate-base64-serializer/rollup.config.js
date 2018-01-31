import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateBase64Serializer',
  globals: {
    slate: 'Slate',
  },
  external: [
    'slate',
  ],
}

export default rollupConfig({ pkg, umd })
