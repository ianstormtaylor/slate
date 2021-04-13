import { Editor, Path, PathRef, PointRef, RangeRef } from '..'

export const DIRTY_PATHS: WeakMap<Editor<any>, Path[]> = new WeakMap()
export const FLUSHING: WeakMap<Editor<any>, boolean> = new WeakMap()
export const NORMALIZING: WeakMap<Editor<any>, boolean> = new WeakMap()
export const PATH_REFS: WeakMap<Editor<any>, Set<PathRef>> = new WeakMap()
export const POINT_REFS: WeakMap<Editor<any>, Set<PointRef>> = new WeakMap()
export const RANGE_REFS: WeakMap<Editor<any>, Set<RangeRef>> = new WeakMap()
