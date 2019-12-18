import { Command, Element, Operation, Range, Node, NodeEntry } from '../..'

import { ElementQueries } from './queries/element'
import { GeneralTransforms } from './transforms/general'
import { GeneralQueries } from './queries/general'
import { LocationQueries } from './queries/location'
import { NodeTransforms } from './transforms/node'
import { RangeQueries } from './queries/range'
import { SelectionTransforms } from './transforms/selection'
import { TextTransforms } from './transforms/text'

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */

export interface Editor {
  children: Node[]
  selection: Range | null
  operations: Operation[]
  marks: Record<string, any> | null
  apply: (operation: Operation) => void
  exec: (command: Command) => void
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: () => void
  [key: string]: any
}

export const Editor = {
  ...ElementQueries,
  ...GeneralQueries,
  ...GeneralTransforms,
  ...LocationQueries,
  ...NodeTransforms,
  ...RangeQueries,
  ...SelectionTransforms,
  ...TextTransforms,
}
