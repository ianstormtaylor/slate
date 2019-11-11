import {
  createHyperscript,
  HyperscriptCreators,
  HyperscriptShorthands,
} from './hyperscript'

/**
 * The default hyperscript factory that ships with Slate, without custom tags.
 */

const jsx = createHyperscript()

export { jsx, createHyperscript, HyperscriptCreators, HyperscriptShorthands }
