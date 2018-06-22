import factory from './factory'
import slate from '../../packages/slate/package.json'
import slateBase64Serializer from '../../packages/slate-base64-serializer/package.json'
import slateDevEnvironment from '../../packages/slate-dev-environment/package.json'
import slateDevLogger from '../../packages/slate-dev-logger/package.json'
import slateHotkeys from '../../packages/slate-hotkeys/package.json'
import slateHtmlSerializer from '../../packages/slate-html-serializer/package.json'
import slateHyperscript from '../../packages/slate-hyperscript/package.json'
import slatePlainSerializer from '../../packages/slate-plain-serializer/package.json'
import slatePropTypes from '../../packages/slate-prop-types/package.json'
import slateReact from '../../packages/slate-react/package.json'
import slateSchemaViolations from '../../packages/slate-schema-violations/package.json'
import slateSimulator from '../../packages/slate-simulator/package.json'
// Do not import slateDevBenchmark here. The benchmark shall be a pure nodeJS program and can be run without babel-node

const configurations = [
  ...factory(slate),
  ...factory(slateBase64Serializer),
  ...factory(slateDevEnvironment),
  ...factory(slateDevLogger),
  ...factory(slateHotkeys),
  ...factory(slateHtmlSerializer),
  ...factory(slateHyperscript),
  ...factory(slatePlainSerializer),
  ...factory(slatePropTypes),
  ...factory(slateReact),
  ...factory(slateSchemaViolations),
  ...factory(slateSimulator),
]

export default configurations
