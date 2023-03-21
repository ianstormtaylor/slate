import { isPlainObject } from 'is-plain-object'

import {
  Ancestor,
  ExtendedType,
  Location,
  Node,
  NodeEntry,
  Operation,
  Path,
  PathRef,
  Point,
  PointRef,
  Range,
  RangeRef,
  Span,
  Text,
} from '..'
import {
  getCharacterDistance,
  getWordDistance,
  splitByCharacterDistance,
} from '../utils/string'
import {
  DIRTY_PATH_KEYS,
  DIRTY_PATHS,
  NORMALIZING,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
} from '../utils/weak-maps'
import { Element } from './element'
import { Descendant } from './node'
import {
  LeafEdge,
  MaximizeMode,
  RangeDirection,
  SelectionMode,
  TextDirection,
  TextUnit,
  TextUnitAdjustment,
} from './types'

export type BaseSelection = Range | null

export type Selection = ExtendedType<'Selection', BaseSelection>

export type EditorMarks = Omit<Text, 'text'>

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */

export interface BaseEditor {
  children: Descendant[]
  selection: Selection
  operations: Operation[]
  marks: EditorMarks | null

  // Schema-specific node behaviors.
  isElementReadOnly: (element: Element) => boolean
  isInline: (element: Element) => boolean
  isSelectable: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry, options?: { operation?: Operation }) => void
  onChange: (options?: { operation?: Operation }) => void

  // Overrideable core actions.
  addMark: (key: string, value: any) => void
  apply: (operation: Operation) => void
  deleteBackward: (unit: TextUnit) => void
  deleteForward: (unit: TextUnit) => void
  deleteFragment: (direction?: TextDirection) => void
  getFragment: () => Descendant[]
  insertBreak: () => void
  insertSoftBreak: () => void
  insertFragment: (fragment: Node[]) => void
  insertNode: (node: Node) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
  getDirtyPaths: (operation: Operation) => Path[]
  shouldNormalize: ({
    iteration,
    dirtyPaths,
    operation,
  }: {
    iteration: number
    initialDirtyPathsLength: number
    dirtyPaths: Path[]
    operation?: Operation
  }) => boolean
}

export type Editor = ExtendedType<'Editor', BaseEditor>

export interface EditorAboveOptions<T extends Ancestor> {
  at?: Location
  match?: NodeMatch<T>
  mode?: MaximizeMode
  voids?: boolean
}

export interface EditorAfterOptions {
  distance?: number
  unit?: TextUnitAdjustment
  voids?: boolean
}

export interface EditorBeforeOptions {
  distance?: number
  unit?: TextUnitAdjustment
  voids?: boolean
}

export interface EditorDirectedDeletionOptions {
  unit?: TextUnit
}

export interface EditorElementReadOnlyOptions {
  at?: Location
  mode?: MaximizeMode
  voids?: boolean
}

export interface EditorFragmentDeletionOptions {
  direction?: TextDirection
}

export interface EditorLeafOptions {
  depth?: number
  edge?: LeafEdge
}

export interface EditorLevelsOptions<T extends Node> {
  at?: Location
  match?: NodeMatch<T>
  reverse?: boolean
  voids?: boolean
}

export interface EditorNextOptions<T extends Descendant> {
  at?: Location
  match?: NodeMatch<T>
  mode?: SelectionMode
  voids?: boolean
}

export interface EditorNodeOptions {
  depth?: number
  edge?: LeafEdge
}

export interface EditorNodesOptions<T extends Node> {
  at?: Location | Span
  match?: NodeMatch<T>
  mode?: SelectionMode
  universal?: boolean
  reverse?: boolean
  voids?: boolean
  ignoreNonSelectable?: boolean
}

export interface EditorNormalizeOptions {
  force?: boolean
  operation?: Operation
}

export interface EditorParentOptions {
  depth?: number
  edge?: LeafEdge
}

export interface EditorPathOptions {
  depth?: number
  edge?: LeafEdge
}

export interface EditorPathRefOptions {
  affinity?: TextDirection | null
}

export interface EditorPointOptions {
  edge?: LeafEdge
}

export interface EditorPointRefOptions {
  affinity?: TextDirection | null
}

export interface EditorPositionsOptions {
  at?: Location
  unit?: TextUnitAdjustment
  reverse?: boolean
  voids?: boolean
  ignoreNonSelectable?: boolean
}

export interface EditorPreviousOptions<T extends Node> {
  at?: Location
  match?: NodeMatch<T>
  mode?: SelectionMode
  voids?: boolean
}

export interface EditorRangeRefOptions {
  affinity?: RangeDirection | null
}

export interface EditorStringOptions {
  voids?: boolean
}

export interface EditorUnhangRangeOptions {
  voids?: boolean
}

export interface EditorVoidOptions {
  at?: Location
  mode?: MaximizeMode
  voids?: boolean
}

export interface EditorInterface {
  above: <T extends Ancestor>(
    editor: Editor,
    options?: EditorAboveOptions<T>
  ) => NodeEntry<T> | undefined
  addMark: (editor: Editor, key: string, value: any) => void
  after: (
    editor: Editor,
    at: Location,
    options?: EditorAfterOptions
  ) => Point | undefined
  before: (
    editor: Editor,
    at: Location,
    options?: EditorBeforeOptions
  ) => Point | undefined
  deleteBackward: (
    editor: Editor,
    options?: EditorDirectedDeletionOptions
  ) => void
  deleteForward: (
    editor: Editor,
    options?: EditorDirectedDeletionOptions
  ) => void
  deleteFragment: (
    editor: Editor,
    options?: EditorFragmentDeletionOptions
  ) => void
  edges: (editor: Editor, at: Location) => [Point, Point]
  elementReadOnly: (
    editor: Editor,
    options?: EditorElementReadOnlyOptions
  ) => NodeEntry<Element> | undefined
  end: (editor: Editor, at: Location) => Point
  first: (editor: Editor, at: Location) => NodeEntry
  fragment: (editor: Editor, at: Location) => Descendant[]
  hasBlocks: (editor: Editor, element: Element) => boolean
  hasInlines: (editor: Editor, element: Element) => boolean
  hasPath: (editor: Editor, path: Path) => boolean
  hasTexts: (editor: Editor, element: Element) => boolean
  insertBreak: (editor: Editor) => void
  insertSoftBreak: (editor: Editor) => void
  insertFragment: (editor: Editor, fragment: Node[]) => void
  insertNode: (editor: Editor, node: Node) => void
  insertText: (editor: Editor, text: string) => void
  isBlock: (editor: Editor, value: Element) => boolean
  isEditor: (value: any) => value is Editor
  isEnd: (editor: Editor, point: Point, at: Location) => boolean
  isEdge: (editor: Editor, point: Point, at: Location) => boolean
  isElementReadOnly: (editor: Editor, element: Element) => boolean
  isEmpty: (editor: Editor, element: Element) => boolean
  isInline: (editor: Editor, value: Element) => boolean
  isNormalizing: (editor: Editor) => boolean
  isSelectable: (editor: Editor, element: Element) => boolean
  isStart: (editor: Editor, point: Point, at: Location) => boolean
  isVoid: (editor: Editor, value: Element) => boolean
  last: (editor: Editor, at: Location) => NodeEntry
  leaf: (
    editor: Editor,
    at: Location,
    options?: EditorLeafOptions
  ) => NodeEntry<Text>
  levels: <T extends Node>(
    editor: Editor,
    options?: EditorLevelsOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  marks: (editor: Editor) => Omit<Text, 'text'> | null
  next: <T extends Descendant>(
    editor: Editor,
    options?: EditorNextOptions<T>
  ) => NodeEntry<T> | undefined
  node: (editor: Editor, at: Location, options?: EditorNodeOptions) => NodeEntry
  nodes: <T extends Node>(
    editor: Editor,
    options?: EditorNodesOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  normalize: (editor: Editor, options?: EditorNormalizeOptions) => void
  parent: (
    editor: Editor,
    at: Location,
    options?: EditorParentOptions
  ) => NodeEntry<Ancestor>
  path: (editor: Editor, at: Location, options?: EditorPathOptions) => Path
  pathRef: (
    editor: Editor,
    path: Path,
    options?: EditorPathRefOptions
  ) => PathRef
  pathRefs: (editor: Editor) => Set<PathRef>
  point: (editor: Editor, at: Location, options?: EditorPointOptions) => Point
  pointRef: (
    editor: Editor,
    point: Point,
    options?: EditorPointRefOptions
  ) => PointRef
  pointRefs: (editor: Editor) => Set<PointRef>
  positions: (
    editor: Editor,
    options?: EditorPositionsOptions
  ) => Generator<Point, void, undefined>
  previous: <T extends Node>(
    editor: Editor,
    options?: EditorPreviousOptions<T>
  ) => NodeEntry<T> | undefined
  range: (editor: Editor, at: Location, to?: Location) => Range
  rangeRef: (
    editor: Editor,
    range: Range,
    options?: EditorRangeRefOptions
  ) => RangeRef
  rangeRefs: (editor: Editor) => Set<RangeRef>
  removeMark: (editor: Editor, key: string) => void
  setNormalizing: (editor: Editor, isNormalizing: boolean) => void
  start: (editor: Editor, at: Location) => Point
  string: (
    editor: Editor,
    at: Location,
    options?: EditorStringOptions
  ) => string
  unhangRange: (
    editor: Editor,
    range: Range,
    options?: EditorUnhangRangeOptions
  ) => Range
  void: (
    editor: Editor,
    options?: EditorVoidOptions
  ) => NodeEntry<Element> | undefined
  withoutNormalizing: (editor: Editor, fn: () => void) => void
}

const IS_EDITOR_CACHE = new WeakMap<object, boolean>()

// eslint-disable-next-line no-redeclare
export const Editor: EditorInterface = {
  /**
   * Get the ancestor above a location in the document.
   */

  above<T extends Ancestor>(
    editor: Editor,
    options: EditorAboveOptions<T> = {}
  ): NodeEntry<T> | undefined {
    const {
      voids = false,
      mode = 'lowest',
      at = editor.selection,
      match,
    } = options

    if (!at) {
      return
    }

    const path = Editor.path(editor, at)
    const reverse = mode === 'lowest'

    for (const [n, p] of Editor.levels(editor, {
      at: path,
      voids,
      match,
      reverse,
    })) {
      if (Text.isText(n)) continue
      if (Range.isRange(at)) {
        if (
          Path.isAncestor(p, at.anchor.path) &&
          Path.isAncestor(p, at.focus.path)
        ) {
          return [n, p]
        }
      } else {
        if (!Path.equals(path, p)) {
          return [n, p]
        }
      }
    }
  },

  /**
   * Add a custom property to the leaf text nodes in the current selection.
   *
   * If the selection is currently collapsed, the marks will be added to the
   * `editor.marks` property instead, and applied when text is inserted next.
   */

  addMark(editor: Editor, key: string, value: any): void {
    editor.addMark(key, value)
  },

  /**
   * Get the point after a location.
   */

  after(
    editor: Editor,
    at: Location,
    options: EditorAfterOptions = {}
  ): Point | undefined {
    const anchor = Editor.point(editor, at, { edge: 'end' })
    const focus = Editor.end(editor, [])
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of Editor.positions(editor, {
      ...options,
      at: range,
    })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  },

  /**
   * Get the point before a location.
   */

  before(
    editor: Editor,
    at: Location,
    options: EditorBeforeOptions = {}
  ): Point | undefined {
    const anchor = Editor.start(editor, [])
    const focus = Editor.point(editor, at, { edge: 'start' })
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of Editor.positions(editor, {
      ...options,
      at: range,
      reverse: true,
    })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  },

  /**
   * Delete content in the editor backward from the current selection.
   */

  deleteBackward(
    editor: Editor,
    options: EditorDirectedDeletionOptions = {}
  ): void {
    const { unit = 'character' } = options
    editor.deleteBackward(unit)
  },

  /**
   * Delete content in the editor forward from the current selection.
   */

  deleteForward(
    editor: Editor,
    options: EditorDirectedDeletionOptions = {}
  ): void {
    const { unit = 'character' } = options
    editor.deleteForward(unit)
  },

  /**
   * Delete the content in the current selection.
   */

  deleteFragment(
    editor: Editor,
    options: EditorFragmentDeletionOptions = {}
  ): void {
    const { direction = 'forward' } = options
    editor.deleteFragment(direction)
  },

  /**
   * Get the start and end points of a location.
   */

  edges(editor: Editor, at: Location): [Point, Point] {
    return [Editor.start(editor, at), Editor.end(editor, at)]
  },

  /**
   * Match a read-only element in the current branch of the editor.
   */

  elementReadOnly(
    editor: Editor,
    options: EditorElementReadOnlyOptions = {}
  ): NodeEntry<Element> | undefined {
    return Editor.above(editor, {
      ...options,
      match: n => Element.isElement(n) && Editor.isElementReadOnly(editor, n),
    })
  },

  /**
   * Get the end point of a location.
   */

  end(editor: Editor, at: Location): Point {
    return Editor.point(editor, at, { edge: 'end' })
  },

  /**
   * Get the first node at a location.
   */

  first(editor: Editor, at: Location): NodeEntry {
    const path = Editor.path(editor, at, { edge: 'start' })
    return Editor.node(editor, path)
  },

  /**
   * Get the fragment at a location.
   */

  fragment(editor: Editor, at: Location): Descendant[] {
    const range = Editor.range(editor, at)
    const fragment = Node.fragment(editor, range)
    return fragment
  },
  /**
   * Check if a node has block children.
   */

  hasBlocks(editor: Editor, element: Element): boolean {
    return element.children.some(
      n => Element.isElement(n) && Editor.isBlock(editor, n)
    )
  },

  /**
   * Check if a node has inline and text children.
   */

  hasInlines(editor: Editor, element: Element): boolean {
    return element.children.some(
      n => Text.isText(n) || Editor.isInline(editor, n)
    )
  },

  /**
   * Check if a node has text children.
   */

  hasTexts(editor: Editor, element: Element): boolean {
    return element.children.every(n => Text.isText(n))
  },

  /**
   * Insert a block break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertBreak(editor: Editor): void {
    editor.insertBreak()
  },

  /**
   * Insert a soft break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertSoftBreak(editor: Editor): void {
    editor.insertSoftBreak()
  },

  /**
   * Insert a fragment at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertFragment(editor: Editor, fragment: Node[]): void {
    editor.insertFragment(fragment)
  },

  /**
   * Insert a node at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertNode(editor: Editor, node: Node): void {
    editor.insertNode(node)
  },

  /**
   * Insert text at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertText(editor: Editor, text: string): void {
    editor.insertText(text)
  },

  /**
   * Check if a value is a block `Element` object.
   */

  isBlock(editor: Editor, value: Element): boolean {
    return !editor.isInline(value)
  },

  /**
   * Check if a value is an `Editor` object.
   */

  isEditor(value: any): value is Editor {
    const cachedIsEditor = IS_EDITOR_CACHE.get(value)
    if (cachedIsEditor !== undefined) {
      return cachedIsEditor
    }

    if (!isPlainObject(value)) {
      return false
    }

    const isEditor =
      typeof value.addMark === 'function' &&
      typeof value.apply === 'function' &&
      typeof value.deleteBackward === 'function' &&
      typeof value.deleteForward === 'function' &&
      typeof value.deleteFragment === 'function' &&
      typeof value.insertBreak === 'function' &&
      typeof value.insertSoftBreak === 'function' &&
      typeof value.insertFragment === 'function' &&
      typeof value.insertNode === 'function' &&
      typeof value.insertText === 'function' &&
      typeof value.isElementReadOnly === 'function' &&
      typeof value.isInline === 'function' &&
      typeof value.isSelectable === 'function' &&
      typeof value.isVoid === 'function' &&
      typeof value.normalizeNode === 'function' &&
      typeof value.onChange === 'function' &&
      typeof value.removeMark === 'function' &&
      typeof value.getDirtyPaths === 'function' &&
      (value.marks === null || isPlainObject(value.marks)) &&
      (value.selection === null || Range.isRange(value.selection)) &&
      Node.isNodeList(value.children) &&
      Operation.isOperationList(value.operations)
    IS_EDITOR_CACHE.set(value, isEditor)
    return isEditor
  },

  /**
   * Check if a point is the end point of a location.
   */

  isEnd(editor: Editor, point: Point, at: Location): boolean {
    const end = Editor.end(editor, at)
    return Point.equals(point, end)
  },

  /**
   * Check if a point is an edge of a location.
   */

  isEdge(editor: Editor, point: Point, at: Location): boolean {
    return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at)
  },

  /**
   * Check if an element is empty, accounting for void nodes.
   */

  isEmpty(editor: Editor, element: Element): boolean {
    const { children } = element
    const [first] = children
    return (
      children.length === 0 ||
      (children.length === 1 &&
        Text.isText(first) &&
        first.text === '' &&
        !editor.isVoid(element))
    )
  },

  /**
   * Check if a value is an inline `Element` object.
   */

  isInline(editor: Editor, value: Element): boolean {
    return editor.isInline(value)
  },

  /**
   * Check if a value is a read-only `Element` object.
   */

  isElementReadOnly(editor: Editor, value: Element): boolean {
    return editor.isElementReadOnly(value)
  },

  /**
   * Check if the editor is currently normalizing after each operation.
   */

  isNormalizing(editor: Editor): boolean {
    const isNormalizing = NORMALIZING.get(editor)
    return isNormalizing === undefined ? true : isNormalizing
  },

  /**
   * Check if a value is a selectable `Element` object.
   */

  isSelectable(editor: Editor, value: Element): boolean {
    return editor.isSelectable(value)
  },

  /**
   * Check if a point is the start point of a location.
   */

  isStart(editor: Editor, point: Point, at: Location): boolean {
    // PERF: If the offset isn't `0` we know it's not the start.
    if (point.offset !== 0) {
      return false
    }

    const start = Editor.start(editor, at)
    return Point.equals(point, start)
  },

  /**
   * Check if a value is a void `Element` object.
   */

  isVoid(editor: Editor, value: Element): boolean {
    return editor.isVoid(value)
  },

  /**
   * Get the last node at a location.
   */

  last(editor: Editor, at: Location): NodeEntry {
    const path = Editor.path(editor, at, { edge: 'end' })
    return Editor.node(editor, path)
  },

  /**
   * Get the leaf text node at a location.
   */

  leaf(
    editor: Editor,
    at: Location,
    options: EditorLeafOptions = {}
  ): NodeEntry<Text> {
    const path = Editor.path(editor, at, options)
    const node = Node.leaf(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the levels at a location.
   */

  *levels<T extends Node>(
    editor: Editor,
    options: EditorLevelsOptions<T> = {}
  ): Generator<NodeEntry<T>, void, undefined> {
    const { at = editor.selection, reverse = false, voids = false } = options
    let { match } = options

    if (match == null) {
      match = () => true
    }

    if (!at) {
      return
    }

    const levels: NodeEntry<T>[] = []
    const path = Editor.path(editor, at)

    for (const [n, p] of Node.levels(editor, path)) {
      if (!match(n, p)) {
        continue
      }

      levels.push([n, p])

      if (!voids && Element.isElement(n) && Editor.isVoid(editor, n)) {
        break
      }
    }

    if (reverse) {
      levels.reverse()
    }

    yield* levels
  },

  /**
   * Get the marks that would be added to text at the current selection.
   */

  marks(editor: Editor): Omit<Text, 'text'> | null {
    const { marks, selection } = editor

    if (!selection) {
      return null
    }

    if (marks) {
      return marks
    }

    if (Range.isExpanded(selection)) {
      const [match] = Editor.nodes(editor, { match: Text.isText })

      if (match) {
        const [node] = match as NodeEntry<Text>
        const { text, ...rest } = node
        return rest
      } else {
        return {}
      }
    }

    const { anchor } = selection
    const { path } = anchor
    let [node] = Editor.leaf(editor, path)

    if (anchor.offset === 0) {
      const prev = Editor.previous(editor, { at: path, match: Text.isText })
      const markedVoid = Editor.above(editor, {
        match: n =>
          Element.isElement(n) &&
          Editor.isVoid(editor, n) &&
          editor.markableVoid(n),
      })
      if (!markedVoid) {
        const block = Editor.above(editor, {
          match: n => Element.isElement(n) && Editor.isBlock(editor, n),
        })

        if (prev && block) {
          const [prevNode, prevPath] = prev
          const [, blockPath] = block

          if (Path.isAncestor(blockPath, prevPath)) {
            node = prevNode as Text
          }
        }
      }
    }

    const { text, ...rest } = node
    return rest
  },

  /**
   * Get the matching node in the branch of the document after a location.
   */

  next<T extends Descendant>(
    editor: Editor,
    options: EditorNextOptions<T> = {}
  ): NodeEntry<T> | undefined {
    const { mode = 'lowest', voids = false } = options
    let { match, at = editor.selection } = options

    if (!at) {
      return
    }

    const pointAfterLocation = Editor.after(editor, at, { voids })

    if (!pointAfterLocation) return

    const [, to] = Editor.last(editor, [])

    const span: Span = [pointAfterLocation.path, to]

    if (Path.isPath(at) && at.length === 0) {
      throw new Error(`Cannot get the next node from the root node!`)
    }

    if (match == null) {
      if (Path.isPath(at)) {
        const [parent] = Editor.parent(editor, at)
        match = n => parent.children.includes(n)
      } else {
        match = () => true
      }
    }

    const [next] = Editor.nodes(editor, { at: span, match, mode, voids })
    return next
  },

  /**
   * Get the node at a location.
   */

  node(
    editor: Editor,
    at: Location,
    options: EditorNodeOptions = {}
  ): NodeEntry {
    const path = Editor.path(editor, at, options)
    const node = Node.get(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the nodes in the Editor.
   */

  *nodes<T extends Node>(
    editor: Editor,
    options: EditorNodesOptions<T> = {}
  ): Generator<NodeEntry<T>, void, undefined> {
    const {
      at = editor.selection,
      mode = 'all',
      universal = false,
      reverse = false,
      voids = false,
      ignoreNonSelectable = false,
    } = options
    let { match } = options

    if (!match) {
      match = () => true
    }

    if (!at) {
      return
    }

    let from
    let to

    if (Span.isSpan(at)) {
      from = at[0]
      to = at[1]
    } else {
      const first = Editor.path(editor, at, { edge: 'start' })
      const last = Editor.path(editor, at, { edge: 'end' })
      from = reverse ? last : first
      to = reverse ? first : last
    }

    const nodeEntries = Node.nodes(editor, {
      reverse,
      from,
      to,
      pass: ([node]) => {
        if (!Element.isElement(node)) return false
        if (
          !voids &&
          (Editor.isVoid(editor, node) ||
            Editor.isElementReadOnly(editor, node))
        )
          return true
        if (ignoreNonSelectable && !Editor.isSelectable(editor, node))
          return true
        return false
      },
    })

    const matches: NodeEntry<T>[] = []
    let hit: NodeEntry<T> | undefined

    for (const [node, path] of nodeEntries) {
      if (
        ignoreNonSelectable &&
        Element.isElement(node) &&
        !Editor.isSelectable(editor, node)
      ) {
        continue
      }

      const isLower = hit && Path.compare(path, hit[1]) === 0

      // In highest mode any node lower than the last hit is not a match.
      if (mode === 'highest' && isLower) {
        continue
      }

      if (!match(node, path)) {
        // If we've arrived at a leaf text node that is not lower than the last
        // hit, then we've found a branch that doesn't include a match, which
        // means the match is not universal.
        if (universal && !isLower && Text.isText(node)) {
          return
        } else {
          continue
        }
      }

      // If there's a match and it's lower than the last, update the hit.
      if (mode === 'lowest' && isLower) {
        hit = [node, path]
        continue
      }

      // In lowest mode we emit the last hit, once it's guaranteed lowest.
      const emit: NodeEntry<T> | undefined =
        mode === 'lowest' ? hit : [node, path]

      if (emit) {
        if (universal) {
          matches.push(emit)
        } else {
          yield emit
        }
      }

      hit = [node, path]
    }

    // Since lowest is always emitting one behind, catch up at the end.
    if (mode === 'lowest' && hit) {
      if (universal) {
        matches.push(hit)
      } else {
        yield hit
      }
    }

    // Universal defers to ensure that the match occurs in every branch, so we
    // yield all of the matches after iterating.
    if (universal) {
      yield* matches
    }
  },
  /**
   * Normalize any dirty objects in the editor.
   */

  normalize(editor: Editor, options: EditorNormalizeOptions = {}): void {
    const { force = false, operation } = options
    const getDirtyPaths = (editor: Editor) => {
      return DIRTY_PATHS.get(editor) || []
    }

    const getDirtyPathKeys = (editor: Editor) => {
      return DIRTY_PATH_KEYS.get(editor) || new Set()
    }

    const popDirtyPath = (editor: Editor): Path => {
      const path = getDirtyPaths(editor).pop()!
      const key = path.join(',')
      getDirtyPathKeys(editor).delete(key)
      return path
    }

    if (!Editor.isNormalizing(editor)) {
      return
    }

    if (force) {
      const allPaths = Array.from(Node.nodes(editor), ([, p]) => p)
      const allPathKeys = new Set(allPaths.map(p => p.join(',')))
      DIRTY_PATHS.set(editor, allPaths)
      DIRTY_PATH_KEYS.set(editor, allPathKeys)
    }

    if (getDirtyPaths(editor).length === 0) {
      return
    }

    Editor.withoutNormalizing(editor, () => {
      /*
        Fix dirty elements with no children.
        editor.normalizeNode() does fix this, but some normalization fixes also require it to work.
        Running an initial pass avoids the catch-22 race condition.
      */
      for (const dirtyPath of getDirtyPaths(editor)) {
        if (Node.has(editor, dirtyPath)) {
          const entry = Editor.node(editor, dirtyPath)
          const [node, _] = entry

          /*
            The default normalizer inserts an empty text node in this scenario, but it can be customised.
            So there is some risk here.

            As long as the normalizer only inserts child nodes for this case it is safe to do in any order;
            by definition adding children to an empty node can't cause other paths to change.
          */
          if (Element.isElement(node) && node.children.length === 0) {
            editor.normalizeNode(entry, { operation })
          }
        }
      }

      let dirtyPaths = getDirtyPaths(editor)
      const initialDirtyPathsLength = dirtyPaths.length
      let iteration = 0

      while (dirtyPaths.length !== 0) {
        if (
          !editor.shouldNormalize({
            dirtyPaths,
            iteration,
            initialDirtyPathsLength,
            operation,
          })
        ) {
          return
        }

        const dirtyPath = popDirtyPath(editor)

        // If the node doesn't exist in the tree, it does not need to be normalized.
        if (Node.has(editor, dirtyPath)) {
          const entry = Editor.node(editor, dirtyPath)
          editor.normalizeNode(entry, { operation })
        }
        iteration++
        dirtyPaths = getDirtyPaths(editor)
      }
    })
  },

  /**
   * Get the parent node of a location.
   */

  parent(
    editor: Editor,
    at: Location,
    options: EditorParentOptions = {}
  ): NodeEntry<Ancestor> {
    const path = Editor.path(editor, at, options)
    const parentPath = Path.parent(path)
    const entry = Editor.node(editor, parentPath)
    return entry as NodeEntry<Ancestor>
  },

  /**
   * Get the path of a location.
   */

  path(editor: Editor, at: Location, options: EditorPathOptions = {}): Path {
    const { depth, edge } = options

    if (Path.isPath(at)) {
      if (edge === 'start') {
        const [, firstPath] = Node.first(editor, at)
        at = firstPath
      } else if (edge === 'end') {
        const [, lastPath] = Node.last(editor, at)
        at = lastPath
      }
    }

    if (Range.isRange(at)) {
      if (edge === 'start') {
        at = Range.start(at)
      } else if (edge === 'end') {
        at = Range.end(at)
      } else {
        at = Path.common(at.anchor.path, at.focus.path)
      }
    }

    if (Point.isPoint(at)) {
      at = at.path
    }

    if (depth != null) {
      at = at.slice(0, depth)
    }

    return at
  },

  hasPath(editor: Editor, path: Path): boolean {
    return Node.has(editor, path)
  },

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   */

  pathRef(
    editor: Editor,
    path: Path,
    options: EditorPathRefOptions = {}
  ): PathRef {
    const { affinity = 'forward' } = options
    const ref: PathRef = {
      current: path,
      affinity,
      unref() {
        const { current } = ref
        const pathRefs = Editor.pathRefs(editor)
        pathRefs.delete(ref)
        ref.current = null
        return current
      },
    }

    const refs = Editor.pathRefs(editor)
    refs.add(ref)
    return ref
  },

  /**
   * Get the set of currently tracked path refs of the editor.
   */

  pathRefs(editor: Editor): Set<PathRef> {
    let refs = PATH_REFS.get(editor)

    if (!refs) {
      refs = new Set()
      PATH_REFS.set(editor, refs)
    }

    return refs
  },

  /**
   * Get the start or end point of a location.
   */

  point(editor: Editor, at: Location, options: EditorPointOptions = {}): Point {
    const { edge = 'start' } = options

    if (Path.isPath(at)) {
      let path

      if (edge === 'end') {
        const [, lastPath] = Node.last(editor, at)
        path = lastPath
      } else {
        const [, firstPath] = Node.first(editor, at)
        path = firstPath
      }

      const node = Node.get(editor, path)

      if (!Text.isText(node)) {
        throw new Error(
          `Cannot get the ${edge} point in the node at path [${at}] because it has no ${edge} text node.`
        )
      }

      return { path, offset: edge === 'end' ? node.text.length : 0 }
    }

    if (Range.isRange(at)) {
      const [start, end] = Range.edges(at)
      return edge === 'start' ? start : end
    }

    return at
  },

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the editor.
   */

  pointRef(
    editor: Editor,
    point: Point,
    options: EditorPointRefOptions = {}
  ): PointRef {
    const { affinity = 'forward' } = options
    const ref: PointRef = {
      current: point,
      affinity,
      unref() {
        const { current } = ref
        const pointRefs = Editor.pointRefs(editor)
        pointRefs.delete(ref)
        ref.current = null
        return current
      },
    }

    const refs = Editor.pointRefs(editor)
    refs.add(ref)
    return ref
  },

  /**
   * Get the set of currently tracked point refs of the editor.
   */

  pointRefs(editor: Editor): Set<PointRef> {
    let refs = POINT_REFS.get(editor)

    if (!refs) {
      refs = new Set()
      POINT_REFS.set(editor, refs)
    }

    return refs
  },

  /**
   * Return all the positions in `at` range where a `Point` can be placed.
   *
   * By default, moves forward by individual offsets at a time, but
   * the `unit` option can be used to to move by character, word, line, or block.
   *
   * The `reverse` option can be used to change iteration direction.
   *
   * Note: By default void nodes are treated as a single point and iteration
   * will not happen inside their content unless you pass in true for the
   * `voids` option, then iteration will occur.
   */

  *positions(
    editor: Editor,
    options: EditorPositionsOptions = {}
  ): Generator<Point, void, undefined> {
    const {
      at = editor.selection,
      unit = 'offset',
      reverse = false,
      voids = false,
      ignoreNonSelectable = false,
    } = options

    if (!at) {
      return
    }

    /**
     * Algorithm notes:
     *
     * Each step `distance` is dynamic depending on the underlying text
     * and the `unit` specified.  Each step, e.g., a line or word, may
     * span multiple text nodes, so we iterate through the text both on
     * two levels in step-sync:
     *
     * `leafText` stores the text on a text leaf level, and is advanced
     * through using the counters `leafTextOffset` and `leafTextRemaining`.
     *
     * `blockText` stores the text on a block level, and is shortened
     * by `distance` every time it is advanced.
     *
     * We only maintain a window of one blockText and one leafText because
     * a block node always appears before all of its leaf nodes.
     */

    const range = Editor.range(editor, at)
    const [start, end] = Range.edges(range)
    const first = reverse ? end : start
    let isNewBlock = false
    let blockText = ''
    let distance = 0 // Distance for leafText to catch up to blockText.
    let leafTextRemaining = 0
    let leafTextOffset = 0

    // Iterate through all nodes in range, grabbing entire textual content
    // of block nodes in blockText, and text nodes in leafText.
    // Exploits the fact that nodes are sequenced in such a way that we first
    // encounter the block node, then all of its text nodes, so when iterating
    // through the blockText and leafText we just need to remember a window of
    // one block node and leaf node, respectively.
    for (const [node, path] of Editor.nodes(editor, {
      at,
      reverse,
      voids,
      ignoreNonSelectable,
    })) {
      /*
       * ELEMENT NODE - Yield position(s) for voids, collect blockText for blocks
       */
      if (Element.isElement(node)) {
        // Void nodes are a special case, so by default we will always
        // yield their first point. If the `voids` option is set to true,
        // then we will iterate over their content.
        if (!voids && (editor.isVoid(node) || editor.isElementReadOnly(node))) {
          yield Editor.start(editor, path)
          continue
        }

        // Inline element nodes are ignored as they don't themselves
        // contribute to `blockText` or `leafText` - their parent and
        // children do.
        if (editor.isInline(node)) continue

        // Block element node - set `blockText` to its text content.
        if (Editor.hasInlines(editor, node)) {
          // We always exhaust block nodes before encountering a new one:
          //   console.assert(blockText === '',
          //     `blockText='${blockText}' - `+
          //     `not exhausted before new block node`, path)

          // Ensure range considered is capped to `range`, in the
          // start/end edge cases where block extends beyond range.
          // Equivalent to this, but presumably more performant:
          //   blockRange = Editor.range(editor, ...Editor.edges(editor, path))
          //   blockRange = Range.intersection(range, blockRange) // intersect
          //   blockText = Editor.string(editor, blockRange, { voids })
          const e = Path.isAncestor(path, end.path)
            ? end
            : Editor.end(editor, path)
          const s = Path.isAncestor(path, start.path)
            ? start
            : Editor.start(editor, path)

          blockText = Editor.string(editor, { anchor: s, focus: e }, { voids })
          isNewBlock = true
        }
      }

      /*
       * TEXT LEAF NODE - Iterate through text content, yielding
       * positions every `distance` offset according to `unit`.
       */
      if (Text.isText(node)) {
        const isFirst = Path.equals(path, first.path)

        // Proof that we always exhaust text nodes before encountering a new one:
        //   console.assert(leafTextRemaining <= 0,
        //     `leafTextRemaining=${leafTextRemaining} - `+
        //     `not exhausted before new leaf text node`, path)

        // Reset `leafText` counters for new text node.
        if (isFirst) {
          leafTextRemaining = reverse
            ? first.offset
            : node.text.length - first.offset
          leafTextOffset = first.offset // Works for reverse too.
        } else {
          leafTextRemaining = node.text.length
          leafTextOffset = reverse ? leafTextRemaining : 0
        }

        // Yield position at the start of node (potentially).
        if (isFirst || isNewBlock || unit === 'offset') {
          yield { path, offset: leafTextOffset }
          isNewBlock = false
        }

        // Yield positions every (dynamically calculated) `distance` offset.
        while (true) {
          // If `leafText` has caught up with `blockText` (distance=0),
          // and if blockText is exhausted, break to get another block node,
          // otherwise advance blockText forward by the new `distance`.
          if (distance === 0) {
            if (blockText === '') break
            distance = calcDistance(blockText, unit, reverse)
            // Split the string at the previously found distance and use the
            // remaining string for the next iteration.
            blockText = splitByCharacterDistance(
              blockText,
              distance,
              reverse
            )[1]
          }

          // Advance `leafText` by the current `distance`.
          leafTextOffset = reverse
            ? leafTextOffset - distance
            : leafTextOffset + distance
          leafTextRemaining = leafTextRemaining - distance

          // If `leafText` is exhausted, break to get a new leaf node
          // and set distance to the overflow amount, so we'll (maybe)
          // catch up to blockText in the next leaf text node.
          if (leafTextRemaining < 0) {
            distance = -leafTextRemaining
            break
          }

          // Successfully walked `distance` offsets through `leafText`
          // to catch up with `blockText`, so we can reset `distance`
          // and yield this position in this node.
          distance = 0
          yield { path, offset: leafTextOffset }
        }
      }
    }
    // Proof that upon completion, we've exahusted both leaf and block text:
    //   console.assert(leafTextRemaining <= 0, "leafText wasn't exhausted")
    //   console.assert(blockText === '', "blockText wasn't exhausted")

    // Helper:
    // Return the distance in offsets for a step of size `unit` on given string.
    function calcDistance(text: string, unit: string, reverse?: boolean) {
      if (unit === 'character') {
        return getCharacterDistance(text, reverse)
      } else if (unit === 'word') {
        return getWordDistance(text, reverse)
      } else if (unit === 'line' || unit === 'block') {
        return text.length
      }
      return 1
    }
  },

  /**
   * Get the matching node in the branch of the document before a location.
   */

  previous<T extends Node>(
    editor: Editor,
    options: EditorPreviousOptions<T> = {}
  ): NodeEntry<T> | undefined {
    const { mode = 'lowest', voids = false } = options
    let { match, at = editor.selection } = options

    if (!at) {
      return
    }

    const pointBeforeLocation = Editor.before(editor, at, { voids })

    if (!pointBeforeLocation) {
      return
    }

    const [, to] = Editor.first(editor, [])

    // The search location is from the start of the document to the path of
    // the point before the location passed in
    const span: Span = [pointBeforeLocation.path, to]

    if (Path.isPath(at) && at.length === 0) {
      throw new Error(`Cannot get the previous node from the root node!`)
    }

    if (match == null) {
      if (Path.isPath(at)) {
        const [parent] = Editor.parent(editor, at)
        match = n => parent.children.includes(n)
      } else {
        match = () => true
      }
    }

    const [previous] = Editor.nodes(editor, {
      reverse: true,
      at: span,
      match,
      mode,
      voids,
    })

    return previous
  },

  /**
   * Get a range of a location.
   */

  range(editor: Editor, at: Location, to?: Location): Range {
    if (Range.isRange(at) && !to) {
      return at
    }

    const start = Editor.start(editor, at)
    const end = Editor.end(editor, to || at)
    return { anchor: start, focus: end }
  },

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the editor.
   */

  rangeRef(
    editor: Editor,
    range: Range,
    options: EditorRangeRefOptions = {}
  ): RangeRef {
    const { affinity = 'forward' } = options
    const ref: RangeRef = {
      current: range,
      affinity,
      unref() {
        const { current } = ref
        const rangeRefs = Editor.rangeRefs(editor)
        rangeRefs.delete(ref)
        ref.current = null
        return current
      },
    }

    const refs = Editor.rangeRefs(editor)
    refs.add(ref)
    return ref
  },

  /**
   * Get the set of currently tracked range refs of the editor.
   */

  rangeRefs(editor: Editor): Set<RangeRef> {
    let refs = RANGE_REFS.get(editor)

    if (!refs) {
      refs = new Set()
      RANGE_REFS.set(editor, refs)
    }

    return refs
  },

  /**
   * Remove a custom property from all of the leaf text nodes in the current
   * selection.
   *
   * If the selection is currently collapsed, the removal will be stored on
   * `editor.marks` and applied to the text inserted next.
   */

  removeMark(editor: Editor, key: string): void {
    editor.removeMark(key)
  },

  /**
   * Manually set if the editor should currently be normalizing.
   *
   * Note: Using this incorrectly can leave the editor in an invalid state.
   *
   */
  setNormalizing(editor: Editor, isNormalizing: boolean): void {
    NORMALIZING.set(editor, isNormalizing)
  },

  /**
   * Get the start point of a location.
   */

  start(editor: Editor, at: Location): Point {
    return Editor.point(editor, at, { edge: 'start' })
  },

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option
   */

  string(
    editor: Editor,
    at: Location,
    options: EditorStringOptions = {}
  ): string {
    const { voids = false } = options
    const range = Editor.range(editor, at)
    const [start, end] = Range.edges(range)
    let text = ''

    for (const [node, path] of Editor.nodes(editor, {
      at: range,
      match: Text.isText,
      voids,
    })) {
      let t = node.text

      if (Path.equals(path, end.path)) {
        t = t.slice(0, end.offset)
      }

      if (Path.equals(path, start.path)) {
        t = t.slice(start.offset)
      }

      text += t
    }

    return text
  },

  /**
   * Convert a range into a non-hanging one.
   */

  unhangRange(
    editor: Editor,
    range: Range,
    options: EditorUnhangRangeOptions = {}
  ): Range {
    const { voids = false } = options
    let [start, end] = Range.edges(range)

    // PERF: exit early if we can guarantee that the range isn't hanging.
    if (
      start.offset !== 0 ||
      end.offset !== 0 ||
      Range.isCollapsed(range) ||
      Path.hasPrevious(end.path)
    ) {
      return range
    }

    const endBlock = Editor.above(editor, {
      at: end,
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      voids,
    })
    const blockPath = endBlock ? endBlock[1] : []
    const first = Editor.start(editor, start)
    const before = { anchor: first, focus: end }
    let skip = true

    for (const [node, path] of Editor.nodes(editor, {
      at: before,
      match: Text.isText,
      reverse: true,
      voids,
    })) {
      if (skip) {
        skip = false
        continue
      }

      if (node.text !== '' || Path.isBefore(path, blockPath)) {
        end = { path, offset: node.text.length }
        break
      }
    }

    return { anchor: start, focus: end }
  },

  /**
   * Match a void node in the current branch of the editor.
   */

  void(
    editor: Editor,
    options: EditorVoidOptions = {}
  ): NodeEntry<Element> | undefined {
    return Editor.above(editor, {
      ...options,
      match: n => Element.isElement(n) && Editor.isVoid(editor, n),
    })
  },

  /**
   * Call a function, deferring normalization until after it completes.
   */

  withoutNormalizing(editor: Editor, fn: () => void): void {
    const value = Editor.isNormalizing(editor)
    Editor.setNormalizing(editor, false)
    try {
      fn()
    } finally {
      Editor.setNormalizing(editor, value)
    }
    Editor.normalize(editor)
  },
}

/**
 * A helper type for narrowing matched nodes with a predicate.
 */

export type NodeMatch<T extends Node> =
  | ((node: Node, path: Path) => node is T)
  | ((node: Node, path: Path) => boolean)

export type PropsCompare = (prop: Partial<Node>, node: Partial<Node>) => boolean
export type PropsMerge = (prop: Partial<Node>, node: Partial<Node>) => object
