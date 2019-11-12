import { Editor, Path, PathRef, PointRef, RangeRef } from '..'

/**
 * Weak maps to keep track of instance-level editor state.
 */

export const DIRTY_PATHS: WeakMap<Editor, Path[]> = new WeakMap()
export const NORMALIZING: WeakMap<Editor, boolean> = new WeakMap()
export const FLUSHING: WeakMap<Editor, boolean> = new WeakMap()
export const PATH_REFS: WeakMap<Editor, Set<PathRef>> = new WeakMap()
export const POINT_REFS: WeakMap<Editor, Set<PointRef>> = new WeakMap()
export const RANGE_REFS: WeakMap<Editor, Set<RangeRef>> = new WeakMap()
