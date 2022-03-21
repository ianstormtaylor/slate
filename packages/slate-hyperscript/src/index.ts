import {
  createHyperscript,
  HyperscriptCreators,
  HyperscriptShorthands,
} from './hyperscript'
import {
  createEditor,
  createText,
  createAnchor,
  createCursor,
  createElement,
  createFocus,
  createFragment,
  createSelection,
} from './creators'

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

const jsx = createHyperscript()

export {
  jsx,
  createHyperscript,
  createEditor,
  createText,
  createAnchor,
  createCursor,
  createElement,
  createFocus,
  createFragment,
  createSelection,
  HyperscriptCreators,
  HyperscriptShorthands,
}
