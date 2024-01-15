import { Editor, Operation, Path, Point, Range } from 'slate';
export type StringDiff = {
    start: number;
    end: number;
    text: string;
};
export type TextDiff = {
    id: number;
    path: Path;
    diff: StringDiff;
};
/**
 * Check whether a text diff was applied in a way we can perform the pending action on /
 * recover the pending selection.
 */
export declare function verifyDiffState(editor: Editor, textDiff: TextDiff): boolean;
export declare function applyStringDiff(text: string, ...diffs: StringDiff[]): string;
/**
 * Remove redundant changes from the diff so that it spans the minimal possible range
 */
export declare function normalizeStringDiff(targetText: string, diff: StringDiff): StringDiff | null;
/**
 * Return a string diff that is equivalent to applying b after a spanning the range of
 * both changes
 */
export declare function mergeStringDiffs(targetText: string, a: StringDiff, b: StringDiff): StringDiff | null;
/**
 * Get the slate range the text diff spans.
 */
export declare function targetRange(textDiff: TextDiff): Range;
/**
 * Normalize a 'pending point' a.k.a a point based on the dom state before applying
 * the pending diffs. Since the pending diffs might have been inserted with different
 * marks we have to 'walk' the offset from the starting position to ensure we still
 * have a valid point inside the document
 */
export declare function normalizePoint(editor: Editor, point: Point): Point | null;
/**
 * Normalize a 'pending selection' to ensure it's valid in the current document state.
 */
export declare function normalizeRange(editor: Editor, range: Range): Range | null;
export declare function transformPendingPoint(editor: Editor, point: Point, op: Operation): Point | null;
export declare function transformPendingRange(editor: Editor, range: Range, op: Operation): Range | null;
export declare function transformTextDiff(textDiff: TextDiff, op: Operation): TextDiff | null;
//# sourceMappingURL=diff-text.d.ts.map