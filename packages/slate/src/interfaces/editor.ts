import isPlainObject from 'is-plain-object'
import { reverse as reverseText } from 'esrever'

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
  Transforms,
} from '..'
import {
  DIRTY_PATHS,
  NORMALIZING,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
} from '../utils/weak-maps'
import { getWordDistance, getCharacterDistance } from '../utils/string'
import { Descendant } from './node'
import { Element } from './element'

export type BaseSelection = Range | null

export type Selection = ExtendedType<'Selection', BaseSelection>

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */

export interface BaseEditor {
  children: Descendant[]
  selection: Selection
  operations: Operation[]
  marks: Omit<Text, 'text'> | null

  // Schema-specific node behaviors.
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: () => void

  // Overrideable core actions.
  addMark: (key: string, value: any) => void
  apply: (operation: Operation) => void
  deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void
  deleteFragment: (direction?: 'forward' | 'backward') => void
  getFragment: () => Descendant[]
  insertBreak: () => void
  insertFragment: (fragment: Node[]) => void
  insertNode: (node: Node) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
}

export type Editor = ExtendedType<'Editor', BaseEditor>

export interface EditorInterface {
  above: <T extends Ancestor>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'highest' | 'lowest'
      voids?: boolean
    }
  ) => NodeEntry<T> | undefined
  addMark: (editor: Editor, key: string, value: any) => void
  after: (
    editor: Editor,
    at: Location,
    options?: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      voids?: boolean
    }
  ) => Point | undefined
  before: (
    editor: Editor,
    at: Location,
    options?: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      voids?: boolean
    }
  ) => Point | undefined
  deleteBackward: (
    editor: Editor,
    options?: {
      unit?: 'character' | 'word' | 'line' | 'block'
    }
  ) => void
  deleteForward: (
    editor: Editor,
    options?: {
      unit?: 'character' | 'word' | 'line' | 'block'
    }
  ) => void
  deleteFragment: (
    editor: Editor,
    options?: {
      direction?: 'forward' | 'backward'
    }
  ) => void
  edges: (editor: Editor, at: Location) => [Point, Point]
  end: (editor: Editor, at: Location) => Point
  first: (editor: Editor, at: Location) => NodeEntry
  fragment: (editor: Editor, at: Location) => Descendant[]
  hasBlocks: (editor: Editor, element: Element) => boolean
  hasInlines: (editor: Editor, element: Element) => boolean
  hasPath: (editor: Editor, path: Path) => boolean
  hasTexts: (editor: Editor, element: Element) => boolean
  insertBreak: (editor: Editor) => void
  insertFragment: (editor: Editor, fragment: Node[]) => void
  insertNode: (editor: Editor, node: Node) => void
  insertText: (editor: Editor, text: string) => void
  isBlock: (editor: Editor, value: any) => value is Element
  isEditor: (value: any) => value is Editor
  isEnd: (editor: Editor, point: Point, at: Location) => boolean
  isEdge: (editor: Editor, point: Point, at: Location) => boolean
  isEmpty: (editor: Editor, element: Element) => boolean
  isInline: (editor: Editor, value: any) => value is Element
  isNormalizing: (editor: Editor) => boolean
  isStart: (editor: Editor, point: Point, at: Location) => boolean
  isVoid: (editor: Editor, value: any) => value is Element
  last: (editor: Editor, at: Location) => NodeEntry
  leaf: (
    editor: Editor,
    at: Location,
    options?: {
      depth?: number
      edge?: 'start' | 'end'
    }
  ) => NodeEntry<Text>
  levels: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      reverse?: boolean
      voids?: boolean
    }
  ) => Generator<NodeEntry<T>, void, undefined>
  marks: (editor: Editor) => Omit<Text, 'text'> | null
  next: <T extends Descendant>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    }
  ) => NodeEntry<T> | undefined
  node: (
    editor: Editor,
    at: Location,
    options?: {
      depth?: number
      edge?: 'start' | 'end'
    }
  ) => NodeEntry
  nodes: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location | Span
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      universal?: boolean
      reverse?: boolean
      voids?: boolean
    }
  ) => Generator<NodeEntry<T>, void, undefined>
  normalize: (
    editor: Editor,
    options?: {
      force?: boolean
    }
  ) => void
  parent: (
    editor: Editor,
    at: Location,
    options?: {
      depth?: number
      edge?: 'start' | 'end'
    }
  ) => NodeEntry<Ancestor>
  path: (
    editor: Editor,
    at: Location,
    options?: {
      depth?: number
      edge?: 'start' | 'end'
    }
  ) => Path
  pathRef: (
    editor: Editor,
    path: Path,
    options?: {
      affinity?: 'backward' | 'forward' | null
    }
  ) => PathRef
  pathRefs: (editor: Editor) => Set<PathRef>
  point: (
    editor: Editor,
    at: Location,
    options?: {
      edge?: 'start' | 'end'
    }
  ) => Point
  pointRef: (
    editor: Editor,
    point: Point,
    options?: {
      affinity?: 'backward' | 'forward' | null
    }
  ) => PointRef
  pointRefs: (editor: Editor) => Set<PointRef>
  positions: (
    editor: Editor,
    options?: {
      at?: Location
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      voids?: boolean
    }
  ) => Generator<Point, void, undefined>
  previous: <T extends Node>(
    editor: Editor,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    }
  ) => NodeEntry<T> | undefined
  range: (editor: Editor, at: Location, to?: Location) => Range
  rangeRef: (
    editor: Editor,
    range: Range,
    options?: {
      affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null
    }
  ) => RangeRef
  rangeRefs: (editor: Editor) => Set<RangeRef>
  removeMark: (editor: Editor, key: string) => void
  setNormalizing: (editor: Editor, isNormalizing: boolean) => void
  start: (editor: Editor, at: Location) => Point
  string: (
    editor: Editor,
    at: Location,
    options?: {
      voids?: boolean
    }
  ) => string
  unhangRange: (
    editor: Editor,
    range: Range,
    options?: {
      voids?: boolean
    }
  ) => Range
  void: (
    editor: Editor,
    options?: {
      at?: Location
      mode?: 'highest' | 'lowest'
      voids?: boolean
    }
  ) => NodeEntry<Element> | undefined
  withoutNormalizing: (editor: Editor, fn: () => void) => void
}

const IS_EDITOR_CACHE = new WeakMap<object, boolean>()

export const Editor: EditorInterface = {
  /**
   * Get the ancestor above a location in the document.
   */

  above<T extends Ancestor>(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'highest' | 'lowest'
      voids?: boolean
    } = {}
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
      if (!Text.isText(n) && !Path.equals(path, p)) {
        return [n, p]
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
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      voids?: boolean
    } = {}
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
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      voids?: boolean
    } = {}
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
    options: {
      unit?: 'character' | 'word' | 'line' | 'block'
    } = {}
  ): void {
    const { unit = 'character' } = options
    editor.deleteBackward(unit)
  },

  /**
   * Delete content in the editor forward from the current selection.
   */

  deleteForward(
    editor: Editor,
    options: {
      unit?: 'character' | 'word' | 'line' | 'block'
    } = {}
  ): void {
    const { unit = 'character' } = options
    editor.deleteForward(unit)
  },

  /**
   * Delete the content in the current selection.
   */

  deleteFragment(
    editor: Editor,
    options: {
      direction?: 'forward' | 'backward'
    } = {}
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
    return element.children.some(n => Editor.isBlock(editor, n))
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

  isBlock(editor: Editor, value: any): value is Element {
    return Element.isElement(value) && !editor.isInline(value)
  },

  /**
   * Check if a value is an `Editor` object.
   */

  isEditor(value: any): value is Editor {
    if (!isPlainObject(value)) return false
    const cachedIsEditor = IS_EDITOR_CACHE.get(value)
    if (cachedIsEditor !== undefined) {
      return cachedIsEditor
    }
    const isEditor =
      typeof value.addMark === 'function' &&
      typeof value.apply === 'function' &&
      typeof value.deleteBackward === 'function' &&
      typeof value.deleteForward === 'function' &&
      typeof value.deleteFragment === 'function' &&
      typeof value.insertBreak === 'function' &&
      typeof value.insertFragment === 'function' &&
      typeof value.insertNode === 'function' &&
      typeof value.insertText === 'function' &&
      typeof value.isInline === 'function' &&
      typeof value.isVoid === 'function' &&
      typeof value.normalizeNode === 'function' &&
      typeof value.onChange === 'function' &&
      typeof value.removeMark === 'function' &&
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

  isInline(editor: Editor, value: any): value is Element {
    return Element.isElement(value) && editor.isInline(value)
  },

  /**
   * Check if the editor is currently normalizing after each operation.
   */

  isNormalizing(editor: Editor): boolean {
    const isNormalizing = NORMALIZING.get(editor)
    return isNormalizing === undefined ? true : isNormalizing
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

  isVoid(editor: Editor, value: any): value is Element {
    return Element.isElement(value) && editor.isVoid(value)
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
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
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
    options: {
      at?: Location
      match?: NodeMatch<T>
      reverse?: boolean
      voids?: boolean
    } = {}
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

      if (!voids && Editor.isVoid(editor, n)) {
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
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (prev && block) {
        const [prevNode, prevPath] = prev
        const [, blockPath] = block

        if (Path.isAncestor(blockPath, prevPath)) {
          node = prevNode as Text
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
    options: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    } = {}
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
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
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
    options: {
      at?: Location | Span
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      universal?: boolean
      reverse?: boolean
      voids?: boolean
    } = {}
  ): Generator<NodeEntry<T>, void, undefined> {
    const {
      at = editor.selection,
      mode = 'all',
      universal = false,
      reverse = false,
      voids = false,
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
      pass: ([n]) => (voids ? false : Editor.isVoid(editor, n)),
    })

    const matches: NodeEntry<T>[] = []
    let hit: NodeEntry<T> | undefined

    for (const [node, path] of nodeEntries) {
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

  normalize(
    editor: Editor,
    options: {
      force?: boolean
    } = {}
  ): void {
    const { force = false } = options
    const getDirtyPaths = (editor: Editor) => {
      return DIRTY_PATHS.get(editor) || []
    }

    if (!Editor.isNormalizing(editor)) {
      return
    }

    if (force) {
      const allPaths = Array.from(Node.nodes(editor), ([, p]) => p)
      DIRTY_PATHS.set(editor, allPaths)
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
          const [node, _] = Editor.node(editor, dirtyPath)

          // Add a text child to elements with no children.
          // This is safe to do in any order, by definition it can't cause other paths to change.
          if (Element.isElement(node) && node.children.length === 0) {
            const child = { text: '' }
            Transforms.insertNodes(editor, child, {
              at: dirtyPath.concat(0),
              voids: true,
            })
          }
        }
      }

      const max = getDirtyPaths(editor).length * 42 // HACK: better way?
      let m = 0

      while (getDirtyPaths(editor).length !== 0) {
        if (m > max) {
          throw new Error(`
            Could not completely normalize the editor after ${max} iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.
          `)
        }

        const dirtyPath = getDirtyPaths(editor).pop()!

        // If the node doesn't exist in the tree, it does not need to be normalized.
        if (Node.has(editor, dirtyPath)) {
          const entry = Editor.node(editor, dirtyPath)
          editor.normalizeNode(entry)
        }
        m++
      }
    })
  },

  /**
   * Get the parent node of a location.
   */

  parent(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry<Ancestor> {
    const path = Editor.path(editor, at, options)
    const parentPath = Path.parent(path)
    const entry = Editor.node(editor, parentPath)
    return entry as NodeEntry<Ancestor>
  },

  /**
   * Get the path of a location.
   */

  path(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): Path {
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
    options: {
      affinity?: 'backward' | 'forward' | null
    } = {}
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

  point(
    editor: Editor,
    at: Location,
    options: {
      edge?: 'start' | 'end'
    } = {}
  ): Point {
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
    options: {
      affinity?: 'backward' | 'forward' | null
    } = {}
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
    options: {
      at?: Location
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
      voids?: boolean
    } = {}
  ): Generator<Point, void, undefined> {
    const {
      at = editor.selection,
      unit = 'offset',
      reverse = false,
      voids = false,
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
    for (const [node, path] of Editor.nodes(editor, { at, reverse, voids })) {
      /*
       * ELEMENT NODE - Yield position(s) for voids, collect blockText for blocks
       */
      if (Element.isElement(node)) {
        // Void nodes are a special case, so by default we will always
        // yield their first point. If the `voids` option is set to true,
        // then we will iterate over their content.
        if (!voids && editor.isVoid(node)) {
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
          blockText = reverse ? reverseText(blockText) : blockText
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
            distance = calcDistance(blockText, unit)
            blockText = blockText.slice(distance)
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
    function calcDistance(text: string, unit: string) {
      if (unit === 'character') {
        return getCharacterDistance(text)
      } else if (unit === 'word') {
        return getWordDistance(text)
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
    options: {
      at?: Location
      match?: NodeMatch<T>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    } = {}
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
    options: {
      affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null
    } = {}
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
    options: {
      voids?: boolean
    } = {}
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
    options: {
      voids?: boolean
    } = {}
  ): Range {
    const { voids = false } = options
    let [start, end] = Range.edges(range)

    // PERF: exit early if we can guarantee that the range isn't hanging.
    if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range)) {
      return range
    }

    const endBlock = Editor.above(editor, {
      at: end,
      match: n => Editor.isBlock(editor, n),
    })
    const blockPath = endBlock ? endBlock[1] : []
    const first = Editor.start(editor, [])
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
    options: {
      at?: Location
      mode?: 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ): NodeEntry<Element> | undefined {
    return Editor.above(editor, {
      ...options,
      match: n => Editor.isVoid(editor, n),
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
