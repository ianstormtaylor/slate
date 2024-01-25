import { Operation } from 'slate';
/**
 * `History` objects hold all of the operations that are applied to a value, so
 * they can be undone or redone as necessary.
 */
export interface History {
    redos: Operation[][];
    undos: Operation[][];
}
export declare const History: {
    /**
     * Check if a value is a `History` object.
     */
    isHistory(value: any): value is History;
};
//# sourceMappingURL=history.d.ts.map