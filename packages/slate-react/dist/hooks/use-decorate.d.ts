/// <reference types="react" />
import { Range, NodeEntry } from 'slate';
/**
 * A React context for sharing the `decorate` prop of the editable.
 */
export declare const DecorateContext: import("react").Context<(entry: NodeEntry) => Range[]>;
/**
 * Get the current `decorate` prop of the editable.
 */
export declare const useDecorate: () => (entry: NodeEntry) => Range[];
//# sourceMappingURL=use-decorate.d.ts.map