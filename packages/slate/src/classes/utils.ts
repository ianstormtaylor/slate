import { Editor, Node, Path, PathRef, PointRef, RangeRef, NodeEntry } from '..'

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

/**
 * Weak maps to keep track of instance-level editor state.
 */

export const DIRTY_PATHS: WeakMap<Editor, Path[]> = new WeakMap()
export const NORMALIZING: WeakMap<Editor, boolean> = new WeakMap()
export const FLUSHING: WeakMap<Editor, boolean> = new WeakMap()
export const PATH_REFS: WeakMap<Editor, Set<PathRef>> = new WeakMap()
export const POINT_REFS: WeakMap<Editor, Set<PointRef>> = new WeakMap()
export const RANGE_REFS: WeakMap<Editor, Set<RangeRef>> = new WeakMap()
