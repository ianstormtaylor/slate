import { Node, Ancestor, Editor } from 'slate';
import { Key } from './key';
/**
 * Two weak maps that allow us rebuild a path given a node. They are populated
 * at render time such that after a render occurs we can always backtrack.
 */
export declare const NODE_TO_INDEX: WeakMap<Node, number>;
export declare const NODE_TO_PARENT: WeakMap<Node, Ancestor>;
/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */
export declare const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement>;
export declare const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string>;
export declare const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node>;
export declare const KEY_TO_ELEMENT: WeakMap<Key, HTMLElement>;
export declare const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement>;
export declare const NODE_TO_KEY: WeakMap<Node, Key>;
/**
 * Weak maps for storing editor-related state.
 */
export declare const IS_READ_ONLY: WeakMap<Editor, boolean>;
export declare const IS_FOCUSED: WeakMap<Editor, boolean>;
export declare const IS_DRAGGING: WeakMap<Editor, boolean>;
export declare const IS_CLICKING: WeakMap<Editor, boolean>;
/**
 * Weak map for associating the context `onChange` context with the plugin.
 */
export declare const EDITOR_TO_ON_CHANGE: WeakMap<Editor, () => void>;
/**
 * Symbols.
 */
export declare const PLACEHOLDER_SYMBOL: string;
//# sourceMappingURL=weak-maps.d.ts.map