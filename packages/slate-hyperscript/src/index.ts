import { createHyperscript } from './hyperscript'

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

const jsx = createHyperscript()

export { createEditor, createText } from './creators'
export type { HyperscriptCreators, HyperscriptShorthands } from './hyperscript'
export { createHyperscript } from './hyperscript'
export { jsx }
