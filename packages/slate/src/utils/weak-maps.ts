import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSplitNodeOperation,
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
export const BATCH_INTERNAL_READ_DEPTH: WeakMap<Editor, number> = new WeakMap()
export const BATCH_INTERNAL_WRITE_DEPTH: WeakMap<Editor, number> = new WeakMap()
export const BATCH_OBSERVE_NORMALIZE_DEPTH: WeakMap<Editor, number> =
  new WeakMap()
export const BATCH_DRAFT_CHILDREN: WeakMap<Editor, Descendant[]> = new WeakMap()
export const BATCH_INSERT_NODE_OPS: WeakMap<Editor, BaseInsertNodeOperation[]> =
  new WeakMap()
export const BATCH_LIVE_INSERT_MOVE_OPS: WeakMap<
  Editor,
  (BaseInsertNodeOperation | BaseMoveNodeOperation)[]
> = new WeakMap()
export const BATCH_INSERT_NODE_PARENT_PATH: WeakMap<Editor, Path> =
  new WeakMap()
export const BATCH_INSERT_NODE_SNAPSHOT: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_INSERT_NODE_SNAPSHOT_OPS: WeakMap<Editor, number> =
  new WeakMap()
export const BATCH_TEXT_OPS: WeakMap<
  Editor,
  (BaseInsertTextOperation | BaseRemoveTextOperation)[]
> = new WeakMap()
export const BATCH_TEXT_SNAPSHOT: WeakMap<Editor, Descendant[]> = new WeakMap()
export const BATCH_TEXT_SNAPSHOT_OPS: WeakMap<Editor, number> = new WeakMap()
export const BATCH_MERGE_NODE_OPS: WeakMap<Editor, BaseMergeNodeOperation[]> =
  new WeakMap()
export const BATCH_MERGE_NODE_PARENT_INDEXES: WeakMap<
  Editor,
  Set<number>
> = new WeakMap()
export const BATCH_MERGE_NODE_BASE: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_MERGE_NODE_SNAPSHOT: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_MERGE_NODE_SNAPSHOT_OPS: WeakMap<Editor, number> =
  new WeakMap()
export const BATCH_SPLIT_NODE_OPS: WeakMap<Editor, BaseSplitNodeOperation[]> =
  new WeakMap()
export const BATCH_SPLIT_NODE_PARENT_INDEXES: WeakMap<
  Editor,
  Set<number>
> = new WeakMap()
export const BATCH_SPLIT_NODE_BASE: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_SPLIT_NODE_SNAPSHOT: WeakMap<Editor, Descendant[]> =
  new WeakMap()
export const BATCH_SPLIT_NODE_SNAPSHOT_OPS: WeakMap<Editor, number> =
  new WeakMap()
export const BATCH_EXACT_SET_NODE_OPS: WeakMap<Editor, BaseSetNodeOperation[]> =
  new WeakMap()
export const BATCH_LIVE_MERGE_OPS: WeakMap<Editor, BaseMergeNodeOperation[]> =
  new WeakMap()
export const BATCH_LIVE_SPLIT_OPS: WeakMap<Editor, BaseSplitNodeOperation[]> =
  new WeakMap()
export const BATCH_LIVE_MOVE_OPS: WeakMap<Editor, BaseMoveNodeOperation[]> =
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
