import { Operation, Path } from '..';
/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date path value.
 */
export interface PathRef {
    current: Path | null;
    affinity: 'forward' | 'backward' | null;
    unref(): Path | null;
}
export interface PathRefInterface {
    /**
     * Transform the path ref's current value by an operation.
     */
    transform: (ref: PathRef, op: Operation) => void;
}
export declare const PathRef: PathRefInterface;
//# sourceMappingURL=path-ref.d.ts.map