import { Operation, Range } from 'slate';
interface Batch {
    operations: Operation[];
    selectionBefore: Range | null;
}
/**
 * `History` objects hold all of the operations that are applied to a value, so
 * they can be undone or redone as necessary.
 */
export interface History {
    redos: Batch[];
    undos: Batch[];
}
export declare const History: {
    /**
     * Check if a value is a `History` object.
     */
    isHistory(value: any): value is History;
};
export {};
//# sourceMappingURL=history.d.ts.map