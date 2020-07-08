import { Editor, Path, PathRef, PointRef, RangeRef } from '..';
export declare const DIRTY_PATHS: WeakMap<Editor, Path[]>;
export declare const FLUSHING: WeakMap<Editor, boolean>;
export declare const NORMALIZING: WeakMap<Editor, boolean>;
export declare const PATH_REFS: WeakMap<Editor, Set<PathRef>>;
export declare const POINT_REFS: WeakMap<Editor, Set<PointRef>>;
export declare const RANGE_REFS: WeakMap<Editor, Set<RangeRef>>;
//# sourceMappingURL=weak-maps.d.ts.map