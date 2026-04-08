import { GeneralTransforms } from './general'
import { NodeTransforms } from './node'
import { SelectionTransforms } from './selection'
import { TextTransforms } from './text'

export interface Transforms extends
  GeneralTransforms,
  NodeTransforms,
  SelectionTransforms,
  TextTransforms {}

export const Transforms: GeneralTransforms &
  NodeTransforms &
  SelectionTransforms &
  TextTransforms = {
  ...GeneralTransforms,
  ...NodeTransforms,
  ...SelectionTransforms,
  ...TextTransforms,
}
