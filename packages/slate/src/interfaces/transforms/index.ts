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

export interface TransformsInterface
  extends GeneralTransforms,
    NodeTransforms,
    SelectionTransforms,
    TextTransforms {}

export const Transforms: TransformsInterface = {
  ...GeneralTransforms,
  ...NodeTransforms,
  ...SelectionTransforms,
  ...TextTransforms,
}
