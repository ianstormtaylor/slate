import rollupConfig from '../../support/rollupConfig'
import pkg from './package.json'

const umd = {
  name: 'SlateSchemaViolations',
}

export default rollupConfig({ pkg, umd })
