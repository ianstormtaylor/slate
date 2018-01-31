import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateDevLogger',
}

export default rollupConfig({ pkg, umd })
