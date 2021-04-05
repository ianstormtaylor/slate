import { Node, Ancestor, Value } from 'slate'

import { ReactEditor } from '..'
import { Key } from './key'

type E = ReactEditor<Value>

/**
 * Two weak maps that allow us rebuild a path given a node. They are populated
 * at render time such that after a render occurs we can always backtrack.
 */

export const NODE_TO_INDEX: WeakMap<Node, number> = new WeakMap()
export const NODE_TO_PARENT: WeakMap<Node, Ancestor> = new WeakMap()

/**
 * Weak maps that allow us to go between Slate nodes and DOM nodes. These
 * are used to resolve DOM event-related logic into Slate actions.
 */
export const EDITOR_TO_WINDOW: WeakMap<E, Window> = new WeakMap()
export const EDITOR_TO_ELEMENT: WeakMap<E, HTMLElement> = new WeakMap()
export const EDITOR_TO_PLACEHOLDER: WeakMap<E, string> = new WeakMap()
export const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node> = new WeakMap()
export const KEY_TO_ELEMENT: WeakMap<Key, HTMLElement> = new WeakMap()
export const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement> = new WeakMap()
export const NODE_TO_KEY: WeakMap<Node, Key> = new WeakMap()

/**
 * Weak maps for storing editor-related state.
 */

export const IS_READ_ONLY: WeakMap<E, boolean> = new WeakMap()
export const IS_FOCUSED: WeakMap<E, boolean> = new WeakMap()
export const IS_DRAGGING: WeakMap<E, boolean> = new WeakMap()
export const IS_CLICKING: WeakMap<E, boolean> = new WeakMap()

/**
 * Weak map for associating the context `onChange` context with the plugin.
 */

export const EDITOR_TO_ON_CHANGE = new WeakMap<E, () => void>()
