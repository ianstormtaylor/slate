import { Path, Point, Range } from '..';
/**
 * The `Location` interface is a union of the ways to refer to a specific
 * location in a Slate document: paths, points or ranges.
 *
 * Methods will often accept a `Location` instead of requiring only a `Path`,
 * `Point` or `Range`. This eliminates the need for developers to manage
 * converting between the different interfaces in their own code base.
 */
export declare type Location = Path | Point | Range;
export declare const Location: {
    /**
     * Check if a value implements the `Location` interface.
     */
    isLocation(value: any): value is Location;
};
/**
 * The `Span` interface is a low-level way to refer to locations in nodes
 * without using `Point` which requires leaf text nodes to be present.
 */
export declare type Span = [Path, Path];
export declare const Span: {
    /**
     * Check if a value implements the `Span` interface.
     */
    isSpan(value: any): value is Span;
};
//# sourceMappingURL=location.d.ts.map