import {
  Ancestor,
  Editor,
  Node,
  Operation,
  Point,
  Range,
  RangeRef,
  Text,
} from 'slate'
import { TextDiff } from './diff-text'
import { Key } from './key'

export type Action = { at?: Point | Range; run: () => void }

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
export const EDITOR_TO_WINDOW: WeakMap<Editor, Window> = new WeakMap()
export const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement> = new WeakMap()
export const EDITOR_TO_PLACEHOLDER: WeakMap<Editor, string> = new WeakMap()
export const EDITOR_TO_PLACEHOLDER_ELEMENT: WeakMap<Editor, HTMLElement> =
  new WeakMap()
export const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node> = new WeakMap()
export const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement> = new WeakMap()
export const NODE_TO_KEY: WeakMap<Node, Key> = new WeakMap()
export const EDITOR_TO_KEY_TO_ELEMENT: WeakMap<
  Editor,
  WeakMap<Key, HTMLElement>
> = new WeakMap()

/**
 * Weak maps for storing editor-related state.
 */

export const IS_READ_ONLY: WeakMap<Editor, boolean> = new WeakMap()
export const IS_FOCUSED: WeakMap<Editor, boolean> = new WeakMap()
export const IS_COMPOSING: WeakMap<Editor, boolean> = new WeakMap()

export const EDITOR_TO_USER_SELECTION: WeakMap<Editor, RangeRef | null> =
  new WeakMap()

/**
 * Weak map for associating the context `onChange` context with the plugin.
 */

export const EDITOR_TO_ON_CHANGE = new WeakMap<
  Editor,
  (options?: { operation?: Operation }) => void
>()

/**
 * Weak maps for saving pending state on composition stage.
 */

export const EDITOR_TO_SCHEDULE_FLUSH: WeakMap<Editor, () => void> =
  new WeakMap()

export const EDITOR_TO_PENDING_INSERTION_MARKS: WeakMap<
  Editor,
  Partial<Text> | null
> = new WeakMap()

export const EDITOR_TO_USER_MARKS: WeakMap<Editor, Partial<Text> | null> =
  new WeakMap()

/**
 * Android input handling specific weak-maps
 */

export const EDITOR_TO_PENDING_DIFFS: WeakMap<Editor, TextDiff[]> =
  new WeakMap()

export const EDITOR_TO_PENDING_ACTION: WeakMap<Editor, Action | null> =
  new WeakMap()

export const EDITOR_TO_PENDING_SELECTION: WeakMap<Editor, Range | null> =
  new WeakMap()

export const EDITOR_TO_FORCE_RENDER: WeakMap<Editor, () => void> = new WeakMap()

/**
 * Symbols.
 */

export const PLACEHOLDER_SYMBOL = Symbol('placeholder') as unknown as string
export const MARK_PLACEHOLDER_SYMBOL = Symbol(
  'mark-placeholder'
) as unknown as string
