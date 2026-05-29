import {
  createHyperscript,
  HyperscriptCreators,
  HyperscriptShorthands,
} from './hyperscript'
import { createEditor, createText } from './creators'
import { HyperscriptPointRef, HyperscriptRangeRef } from './refs'

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
  HyperscriptPointRef,
  HyperscriptRangeRef,
  HyperscriptShorthands,
}
