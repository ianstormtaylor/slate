import { GeneralTransforms } from './general'
import { NodeTransforms } from './node'
import { SelectionTransforms } from './selection'
import { TextTransforms } from './text'

export { NodeInsertNodesOptions } from './node'
export {
  SelectionCollapseOptions,
  SelectionMoveOptions,
  SelectionSetPointOptions,
} from './selection'
export {
  TextDeleteOptions,
  TextInsertFragmentOptions,
  TextInsertTextOptions,
} from './text'

/**
 * @expandType GeneralTransforms
 * @expandType NodeTransforms
 * @expandType SelectionTransforms
 * @expandType TextTransforms
 */
export interface Transforms
  extends GeneralTransforms,
    NodeTransforms,
    SelectionTransforms,
    TextTransforms {}

// eslint-disable-next-line no-redeclare
export const Transforms: Transforms = {
  ...GeneralTransforms,
  ...NodeTransforms,
  ...SelectionTransforms,
  ...TextTransforms,
}
