import { Command, Element, Operation, Range, Node, NodeEntry } from '../..'

import { ElementQueries } from './queries/element'
import { GeneralTransforms } from './transforms/general'
import { GeneralQueries } from './queries/general'
import { LocationQueries } from './queries/location'
import { MarkTransforms } from './transforms/mark'
import { NodeTransforms } from './transforms/node'
import { NodeQueries } from './queries/node'
import { RangeQueries } from './queries/range'
import { SelectionTransforms } from './transforms/selection'
import { TextTransforms } from './transforms/text'

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */

export interface Editor {
  apply: (operation: Operation) => void
  children: Node[]
  exec: (command: Command) => void
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: (children: Node[], operations: Operation[]) => void
  operations: Operation[]
  selection: Range | null
  [key: string]: any
}

export const Editor = {
  ...ElementQueries,
  ...GeneralQueries,
  ...GeneralTransforms,
  ...LocationQueries,
  ...MarkTransforms,
  ...NodeQueries,
  ...NodeTransforms,
  ...RangeQueries,
  ...SelectionTransforms,
  ...TextTransforms,
}
