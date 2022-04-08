import {
  createHyperscript,
  HyperscriptCreators,
  HyperscriptShorthands,
} from './hyperscript'
import { createEditor, createText } from './creators'

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

const jsx = createHyperscript()

export {
  jsx,
  createHyperscript,
  createEditor,
  createText,
  HyperscriptCreators,
  HyperscriptShorthands,
}
