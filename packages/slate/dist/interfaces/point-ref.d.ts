import { Operation, Point } from '..';
/**
 * `PointRef` objects keep a specific point in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date point value.
 */
export interface PointRef {
    current: Point | null;
    affinity: 'forward' | 'backward' | null;
    unref(): Point | null;
}
export declare const PointRef: {
    /**
     * Transform the point ref's current value by an operation.
     */
    transform(ref: PointRef, op: Operation): void;
};
//# sourceMappingURL=point-ref.d.ts.map