import { createEditor, createText } from './creators'
import type { HyperscriptCreators, HyperscriptShorthands } from './hyperscript'
import { createHyperscript } from './hyperscript'

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

const jsx = createHyperscript()

export type { HyperscriptCreators, HyperscriptShorthands }
export { createEditor, createHyperscript, createText, jsx }
