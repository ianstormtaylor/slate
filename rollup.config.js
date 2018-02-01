import factory from './support/rollup/factory'
import examplesConfig from './support/rollup/examples'
import pkgSlate from './packages/slate/package.json'
import pkgSlateBase64Serializer from './packages/slate-base64-serializer/package.json'
import pkgSlateDevLogger from './packages/slate-dev-logger/package.json'
import pkgSlateHtmlSerializer from './packages/slate-html-serializer/package.json'
import pkgSlateHyperscript from './packages/slate-hyperscript/package.json'
import pkgSlatePlainSerializer from './packages/slate-plain-serializer/package.json'
import pkgSlatePropTypes from './packages/slate-prop-types/package.json'
import pkgSlateReact from './packages/slate-react/package.json'
import pkgSlateSchemaViolations from './packages/slate-schema-violations/package.json'
import pkgSlateSimulator from './packages/slate-simulator/package.json'

export default [
  ...factory(pkgSlate),
  ...factory(pkgSlateBase64Serializer),
  ...factory(pkgSlateDevLogger),
  ...factory(pkgSlateHtmlSerializer),
  ...factory(pkgSlateHyperscript),
  ...factory(pkgSlatePlainSerializer),
  ...factory(pkgSlatePropTypes),
  ...factory(pkgSlateReact),
  ...factory(pkgSlateSchemaViolations),
  ...factory(pkgSlateSimulator),
  ...examplesConfig,
]
