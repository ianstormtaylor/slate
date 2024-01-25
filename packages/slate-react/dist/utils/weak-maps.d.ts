import { Ancestor, Editor, Node, RangeRef } from 'slate';
import { Key } from './key';
import { TextInsertion } from '../components/android/diff-text';
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
export declare const EDITOR_TO_WINDOW: WeakMap<Editor, Window>;
export declare const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement>;
export declare const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string>;
export declare const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node>;
export declare const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement>;
export declare const NODE_TO_KEY: WeakMap<Node, Key>;
export declare const EDITOR_TO_KEY_TO_ELEMENT: WeakMap<Editor, WeakMap<Key, HTMLElement>>;
/**
 * Weak maps for storing editor-related state.
 */
export declare const IS_READ_ONLY: WeakMap<Editor, boolean>;
export declare const IS_FOCUSED: WeakMap<Editor, boolean>;
export declare const IS_DRAGGING: WeakMap<Editor, boolean>;
export declare const IS_CLICKING: WeakMap<Editor, boolean>;
export declare const IS_COMPOSING: WeakMap<Editor, boolean>;
export declare const IS_ON_COMPOSITION_END: WeakMap<Editor, boolean>;
export declare const EDITOR_TO_USER_SELECTION: WeakMap<Editor, RangeRef>;
/**
 * Weak maps for saving text on composition stage.
 */
export declare const EDITOR_ON_COMPOSITION_TEXT: WeakMap<Editor, TextInsertion[]>;
/**
 * Weak map for associating the context `onChange` context with the plugin.
 */
export declare const EDITOR_TO_ON_CHANGE: WeakMap<import("..").ReactEditor, () => void>;
export declare const NODE_TO_RESTORE_DOM: WeakMap<Node, () => void>;
/**
 * Symbols.
 */
export declare const PLACEHOLDER_SYMBOL: string;
//# sourceMappingURL=weak-maps.d.ts.map