import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlatePropTypes',
  globals: {
    immutable: 'Immutable',
    slate: 'Slate',
  },
  external: [
    'immutable',
    'slate',
  ],
}

export default rollupConfig({ pkg, umd })
