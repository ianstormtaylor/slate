import {
  BaseSetNodeOperation,
  Descendant,
  Editor,
  Operation,
  Path,
  PathRef,
  PointRef,
  RangeRef,
} from '..'

type BatchNormalizeState = {
  force?: boolean
  operation?: Operation
}

export const BATCH_DEPTH: WeakMap<Editor, number> = new WeakMap()
export const BATCH_DRAFT_CHILDREN: WeakMap<Editor, Descendant[]> = new WeakMap()
export const BATCH_EXACT_SET_NODE_OPS: WeakMap<Editor, BaseSetNodeOperation[]> =
  new WeakMap()
export const BATCH_EXACT_SET_NODE_SNAPSHOT: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_EXACT_SET_NODE_SNAPSHOT_OPS: WeakMap<Editor, number> =
  new WeakMap()
export const BATCH_NORMALIZE: WeakMap<Editor, BatchNormalizeState> =
  new WeakMap()
export const BATCH_PENDING_FLUSH: WeakMap<Editor, boolean> = new WeakMap()
export const CHILDREN: WeakMap<Editor, Descendant[]> = new WeakMap()
export const DIRTY_PATHS: WeakMap<Editor, Path[]> = new WeakMap()
export const DIRTY_PATH_KEYS: WeakMap<Editor, Set<string>> = new WeakMap()
export const FLUSHING: WeakMap<Editor, boolean> = new WeakMap()
export const NORMALIZING: WeakMap<Editor, boolean> = new WeakMap()
export const PATH_REFS: WeakMap<Editor, Set<PathRef>> = new WeakMap()
export const POINT_REFS: WeakMap<Editor, Set<PointRef>> = new WeakMap()
export const RANGE_REFS: WeakMap<Editor, Set<RangeRef>> = new WeakMap()
