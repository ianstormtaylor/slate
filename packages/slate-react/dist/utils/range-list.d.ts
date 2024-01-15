import { Range } from 'slate';
export declare const shallowCompare: (obj1: {
    [key: string]: unknown;
}, obj2: {
    [key: string]: unknown;
}) => boolean;
/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */
export declare const isElementDecorationsEqual: (list: Range[], another: Range[]) => boolean;
/**
 * Check if a list of decorator ranges are equal to another.
 *
 * PERF: this requires the two lists to also have the ranges inside them in the
 * same order, but this is an okay constraint for us since decorations are
 * kept in order, and the odd case where they aren't is okay to re-render for.
 */
export declare const isTextDecorationsEqual: (list: Range[], another: Range[]) => boolean;
//# sourceMappingURL=range-list.d.ts.map