import { NodeEntry } from '..'

/**
 * `Match` is a shorthand for a `NodeEntry` predicate for handling the most
 * common needs for rich text editing.
 */

export type Match =
  | number
  | 'value'
  | 'block'
  | 'inline'
  | 'text'
  | 'void'
  | Partial<Node>
  | ((entry: NodeEntry) => boolean)
