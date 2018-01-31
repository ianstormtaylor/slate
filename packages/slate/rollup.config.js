import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'Slate',
  globals: {
    immutable: 'Immutable',
  },
  external: [
    'immutable',
  ],
}

const modules = {
  external: [
    'lodash/isEqual',
    'lodash/mergeWith',
    'lodash/omit',
    'lodash/pick',
  ],
}

export default rollupConfig({ pkg, umd, modules })
