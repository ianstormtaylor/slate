import factory from './factory'
import slate from '../../packages/slate/package.json'
import slateBase64Serializer from '../../packages/slate-base64-serializer/package.json'
import slateDevLogger from '../../packages/slate-dev-logger/package.json'
import slateHtmlSerializer from '../../packages/slate-html-serializer/package.json'
import slateHyperscript from '../../packages/slate-hyperscript/package.json'
import slatePlainSerializer from '../../packages/slate-plain-serializer/package.json'
import slatePropTypes from '../../packages/slate-prop-types/package.json'
import slateReact from '../../packages/slate-react/package.json'
import slateSchemaViolations from '../../packages/slate-schema-violations/package.json'
import slateSimulator from '../../packages/slate-simulator/package.json'

const configurations = [
  ...factory(slate),
  ...factory(slateBase64Serializer),
  ...factory(slateDevLogger),
  ...factory(slateHtmlSerializer),
  ...factory(slateHyperscript),
  ...factory(slatePlainSerializer),
  ...factory(slatePropTypes),
  ...factory(slateReact),
  ...factory(slateSchemaViolations),
  ...factory(slateSimulator),
]

export default configurations
