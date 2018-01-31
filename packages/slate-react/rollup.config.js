import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateReact',
  globals: {
    immutable: 'Immutable',
    react: 'React',
    'react-dom': 'ReactDOM',
    slate: 'Slate',
  },
  external: [
    'immutable',
    'react',
    'react-dom',
    'slate',
  ],
}

const modules = {
  external: [
    'lodash/throttle',
  ],
}

export default rollupConfig({ pkg, umd, modules })
