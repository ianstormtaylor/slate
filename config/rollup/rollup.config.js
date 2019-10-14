import factory from './factory'
import core from '../../packages/slate/package.json'
import base64Serializer from '../../packages/slate-base64-serializer/package.json'
import devEnvironment from '../../packages/slate-dev-environment/package.json'
import hotkeys from '../../packages/slate-hotkeys/package.json'
import htmlSerializer from '../../packages/slate-html-serializer/package.json'
import hyperscript from '../../packages/slate-hyperscript/package.json'
import parsePlaintext from '../../packages/slate-parse-plaintext/package.json'
import plainSerializer from '../../packages/slate-plain-serializer/package.json'
import propTypes from '../../packages/slate-prop-types/package.json'
import react from '../../packages/slate-react/package.json'
import reactPlaceholder from '../../packages/slate-react-placeholder/package.json'
import renderPlaintext from '../../packages/slate-render-plaintext/package.json'

const configurations = [
  ...factory(core, { ts: true }),
  ...factory(base64Serializer),
  ...factory(devEnvironment),
  ...factory(hotkeys),
  ...factory(htmlSerializer),
  ...factory(hyperscript, { ts: true }),
  ...factory(plainSerializer),
  ...factory(parsePlaintext, { ts: true }),
  ...factory(propTypes),
  ...factory(react),
  ...factory(reactPlaceholder),
  ...factory(renderPlaintext, { ts: true }),
]

export default configurations
