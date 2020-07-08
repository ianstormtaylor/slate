import { Operation, Path, Point, PointEntry } from '..';
/**
 * `Range` objects are a set of points that refer to a specific span of a Slate
 * document. They can define a span inside a single node or a can span across
 * multiple nodes.
 */
export interface Range {
    anchor: Point;
    focus: Point;
    [key: string]: unknown;
}
export declare const Range: {
    /**
     * Get the start and end points of a range, in the order in which they appear
     * in the document.
     */
    edges(range: Range, options?: {
        reverse?: boolean | undefined;
    }): [Point, Point];
    /**
     * Get the end point of a range.
     */
    end(range: Range): Point;
    /**
     * Check if a range is exactly equal to another.
     */
    equals(range: Range, another: Range): boolean;
    /**
     * Check if a range includes a path, a point or part of another range.
     */
    includes(range: Range, target: Range | Point | Path): boolean;
    /**
     * Get the intersection of a range with another.
     */
    intersection(range: Range, another: Range): Range | null;
    /**
     * Check if a range is backward, meaning that its anchor point appears in the
     * document _after_ its focus point.
     */
    isBackward(range: Range): boolean;
    /**
     * Check if a range is collapsed, meaning that both its anchor and focus
     * points refer to the exact same position in the document.
     */
    isCollapsed(range: Range): boolean;
    /**
     * Check if a range is expanded.
     *
     * This is the opposite of [[Range.isCollapsed]] and is provided for legibility.
     */
    isExpanded(range: Range): boolean;
    /**
     * Check if a range is forward.
     *
     * This is the opposite of [[Range.isBackward]] and is provided for legibility.
     */
    isForward(range: Range): boolean;
    /**
     * Check if a value implements the [[Range]] interface.
     */
    isRange(value: any): value is Range;
    /**
     * Iterate through all of the point entries in a range.
     */
    points(range: Range): Iterable<PointEntry>;
    /**
     * Get the start point of a range.
     */
    start(range: Range): Point;
    /**
     * Transform a range by an operation.
     */
    transform(range: Range, op: Operation, options: {
        affinity: "forward" | "backward" | "outward" | "inward" | null;
    }): Range | null;
};
//# sourceMappingURL=range.d.ts.map