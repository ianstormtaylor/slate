import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateHtmlSerializer',
  globals: {
    immutable: 'Immutable',
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/server': 'ReactDOMServer',
    slate: 'Slate',
  },
  external: [
    'immutable',
    'react',
    'react-dom',
    'react-dom/server',
    'slate',
  ],
}

const modules = {
  external: [
    'react-dom/server',
  ],
}

export default rollupConfig({ pkg, umd, modules })
