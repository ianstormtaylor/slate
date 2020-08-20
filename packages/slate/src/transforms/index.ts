import { GeneralTransforms } from './general'
import { NodeTransforms } from './node'
import { SelectionTransforms } from './selection'
import { TextTransforms } from './text'

type TransformsType = typeof GeneralTransforms &
  typeof NodeTransforms &
  typeof SelectionTransforms &
  typeof TextTransforms

export const Transforms: TransformsType = Object.assign(
  {},
  GeneralTransforms,
  NodeTransforms,
  SelectionTransforms,
  TextTransforms
)
