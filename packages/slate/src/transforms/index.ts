import { GeneralTransforms } from './general'
import { NodeTransforms } from './node'
import { SelectionTransforms } from './selection'
import { TextTransforms } from './text'

export const Transforms: GeneralTransforms &
  NodeTransforms &
  SelectionTransforms &
  TextTransforms = {
  ...GeneralTransforms,
  ...NodeTransforms,
  ...SelectionTransforms,
  ...TextTransforms,
}
