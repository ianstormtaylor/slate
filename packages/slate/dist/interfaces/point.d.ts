import { Operation, Path } from '..';
/**
 * `Point` objects refer to a specific location in a text node in a Slate
 * document. Its path refers to the location of the node in the tree, and its
 * offset refers to the distance into the node's string of text. Points can
 * only refer to `Text` nodes.
 */
export interface Point {
    path: Path;
    offset: number;
    [key: string]: unknown;
}
export declare const Point: {
    /**
     * Compare a point to another, returning an integer indicating whether the
     * point was before, at, or after the other.
     */
    compare(point: Point, another: Point): 0 | 1 | -1;
    /**
     * Check if a point is after another.
     */
    isAfter(point: Point, another: Point): boolean;
    /**
     * Check if a point is before another.
     */
    isBefore(point: Point, another: Point): boolean;
    /**
     * Check if a point is exactly equal to another.
     */
    equals(point: Point, another: Point): boolean;
    /**
     * Check if a value implements the `Point` interface.
     */
    isPoint(value: any): value is Point;
    /**
     * Transform a point by an operation.
     */
    transform(point: Point, op: Operation, options?: {
        affinity?: "forward" | "backward" | null | undefined;
    }): Point | null;
};
/**
 * `PointEntry` objects are returned when iterating over `Point` objects that
 * belong to a range.
 */
export declare type PointEntry = [Point, 'anchor' | 'focus'];
//# sourceMappingURL=point.d.ts.map