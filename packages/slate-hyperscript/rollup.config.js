import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateHyperscript',
  globals: {
    slate: 'Slate',
  },
  external: [
    'slate',
  ],
}

export default rollupConfig({ pkg, umd })
