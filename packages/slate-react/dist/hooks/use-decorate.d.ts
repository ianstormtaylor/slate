/// <reference types="react" />
import { Range, NodeEntry } from 'slate';
/**
 * A React context for sharing the `decorate` prop of the editable.
 */
export declare const DecorateContext: import("react").Context<(entry: NodeEntry<import("slate").Node>) => Range[]>;
/**
 * Get the current `decorate` prop of the editable.
 */
export declare const useDecorate: () => (entry: NodeEntry<import("slate").Node>) => Range[];
//# sourceMappingURL=use-decorate.d.ts.map