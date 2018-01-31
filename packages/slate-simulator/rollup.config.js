import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateSimulator',
  globals: {
    slate: 'Slate',
  },
  external: [
    'slate',
  ],
}

export default rollupConfig({ pkg, umd })
