import { Ancestor, Editor, Node, Operation, Range, RangeRef, Text } from 'slate';
import { Action } from '../hooks/android-input-manager/android-input-manager';
import { TextDiff } from './diff-text';
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
export declare const EDITOR_TO_WINDOW: WeakMap<Editor, Window>;
export declare const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement>;
export declare const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string>;
export declare const EDITOR_TO_PLACEHOLDER_ELEMENT: WeakMap<Editor, HTMLElement>;
export declare const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node>;
export declare const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement>;
export declare const NODE_TO_KEY: WeakMap<Node, Key>;
export declare const EDITOR_TO_KEY_TO_ELEMENT: WeakMap<Editor, WeakMap<Key, HTMLElement>>;
/**
 * Weak maps for storing editor-related state.
 */
export declare const IS_READ_ONLY: WeakMap<Editor, boolean>;
export declare const IS_FOCUSED: WeakMap<Editor, boolean>;
export declare const IS_COMPOSING: WeakMap<Editor, boolean>;
export declare const EDITOR_TO_USER_SELECTION: WeakMap<Editor, RangeRef | null>;
/**
 * Weak map for associating the context `onChange` context with the plugin.
 */
export declare const EDITOR_TO_ON_CHANGE: WeakMap<import("..").ReactEditor, (options?: {
    operation?: Operation;
}) => void>;
/**
 * Weak maps for saving pending state on composition stage.
 */
export declare const EDITOR_TO_SCHEDULE_FLUSH: WeakMap<Editor, () => void>;
export declare const EDITOR_TO_PENDING_INSERTION_MARKS: WeakMap<Editor, Partial<Text> | null>;
export declare const EDITOR_TO_USER_MARKS: WeakMap<Editor, Partial<Text> | null>;
/**
 * Android input handling specific weak-maps
 */
export declare const EDITOR_TO_PENDING_DIFFS: WeakMap<Editor, TextDiff[]>;
export declare const EDITOR_TO_PENDING_ACTION: WeakMap<Editor, Action | null>;
export declare const EDITOR_TO_PENDING_SELECTION: WeakMap<Editor, Range | null>;
export declare const EDITOR_TO_FORCE_RENDER: WeakMap<Editor, () => void>;
/**
 * Symbols.
 */
export declare const PLACEHOLDER_SYMBOL: string;
export declare const MARK_PLACEHOLDER_SYMBOL: string;
//# sourceMappingURL=weak-maps.d.ts.map