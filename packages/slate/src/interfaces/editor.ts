import isPlainObject from 'is-plain-object'
import { reverse as reverseText } from 'esrever'
import {
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
  AncestorOf,
  ElementOf,
  NodeOf,
  MarksOf,
  TextOf,
  Element,
  NodeMatch,
} from '..'
import {
  DIRTY_PATHS,
  NORMALIZING,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
} from '../utils/weak-maps'
import { getWordDistance, getCharacterDistance } from '../utils/string'

const IS_EDITOR_CACHE = new WeakMap<object, boolean>()

export type Value = Element[]

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */

export type Editor<V extends Value> = {
  children: V
  selection: Selection
  operations: Operation[]
  marks: Record<string, any> | null
  [key: string]: unknown

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
  getFragment: () => Array<Element | Text>
  insertBreak: () => void
  insertFragment: (fragment: Array<Element | Text>) => void
  insertNode: (node: Element | Text | Array<Element | Text>) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
}

export const Editor = {
  /**
   * Get the ancestor above a location in the document.
   */

  above<V extends Value>(
    editor: Editor<V>,
    options: {
      at?: Location
      match?: NodeMatch<AncestorOf<Editor<V>>>
      mode?: 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ): NodeEntry<AncestorOf<Editor<V>>> | undefined {
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

  addMark<
    V extends Value,
    M extends MarksOf<Editor<V>>,
    K extends keyof M & string
  >(
    editor: Editor<V>,
    key: {} extends M ? string : K,
    value: {} extends M ? unknown : M[K]
  ): void {
    editor.addMark(key, value)
  },

  /**
   * Get the point after a location.
   */

  after<V extends Value>(
    editor: Editor<V>,
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

  before<V extends Value>(
    editor: Editor<V>,
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

  deleteBackward<V extends Value>(
    editor: Editor<V>,
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

  deleteForward<V extends Value>(
    editor: Editor<V>,
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

  deleteFragment<V extends Value>(
    editor: Editor<V>,
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

  edges<V extends Value>(editor: Editor<V>, at: Location): [Point, Point] {
    return [Editor.start(editor, at), Editor.end(editor, at)]
  },

  /**
   * Get the end point of a location.
   */

  end<V extends Value>(editor: Editor<V>, at: Location): Point {
    return Editor.point(editor, at, { edge: 'end' })
  },

  /**
   * Get the first node at a location.
   */

  first<V extends Value>(
    editor: Editor<V>,
    at: Location
  ): NodeEntry<NodeOf<Editor<V>>> {
    const path = Editor.path(editor, at, { edge: 'start' })
    const first = Editor.node(editor, path)
    return first
  },

  /**
   * Get the fragment at a location.
   */

  fragment<V extends Value>(
    editor: Editor<V>,
    at: Location
  ): Array<ElementOf<Editor<V>> | TextOf<Editor<V>>> {
    const range = Editor.range(editor, at)
    const fragment = Node.fragment(editor, range)
    return fragment
  },

  /**
   * Check if a node has block children.
   */

  hasBlocks<V extends Value>(editor: Editor<V>, element: Element): boolean {
    return element.children.some(n => Editor.isBlock(editor, n))
  },

  /**
   * Check if a node has inline and text children.
   */

  hasInlines<V extends Value>(editor: Editor<V>, element: Element): boolean {
    return element.children.some(
      n => Text.isText(n) || Editor.isInline(editor, n)
    )
  },

  /**
   * Check if a node has text children.
   */

  hasTexts<V extends Value>(editor: Editor<V>, element: Element): boolean {
    return element.children.every(n => Text.isText(n))
  },

  /**
   * Insert a block break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertBreak<V extends Value>(editor: Editor<V>): void {
    editor.insertBreak()
  },

  /**
   * Insert a fragment at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertFragment<V extends Value>(
    editor: Editor<V>,
    fragment: Array<ElementOf<Editor<V>> | TextOf<Editor<V>>>
  ): void {
    editor.insertFragment(fragment)
  },

  /**
   * Insert a node at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertNode<V extends Value>(
    editor: Editor<V>,
    node:
      | ElementOf<Editor<V>>
      | TextOf<Editor<V>>
      | Array<ElementOf<Editor<V>> | TextOf<Editor<V>>>
  ): void {
    editor.insertNode(node)
  },

  /**
   * Insert text at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */

  insertText<V extends Value>(editor: Editor<V>, text: string): void {
    editor.insertText(text)
  },

  /**
   * Check if a value is a block `Element` object.
   */

  isBlock<V extends Value>(editor: Editor<V>, value: any): value is Element {
    return Element.isElement(value) && !editor.isInline(value)
  },

  /**
   * Check if a value is an `Editor` object.
   */

  isEditor(value: any): value is Editor<Value> {
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

  isEnd<V extends Value>(
    editor: Editor<V>,
    point: Point,
    at: Location
  ): boolean {
    const end = Editor.end(editor, at)
    return Point.equals(point, end)
  },

  /**
   * Check if a point is an edge of a location.
   */

  isEdge<V extends Value>(
    editor: Editor<V>,
    point: Point,
    at: Location
  ): boolean {
    return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at)
  },

  /**
   * Check if an element is empty, accounting for void nodes.
   */

  isEmpty<V extends Value>(
    editor: Editor<V>,
    element: ElementOf<Editor<V>>
  ): boolean {
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

  isInline<V extends Value>(editor: Editor<V>, value: any): value is Element {
    return Element.isElement(value) && editor.isInline(value as any)
  },

  /**
   * Check if the editor is currently normalizing after each operation.
   */

  isNormalizing<V extends Value>(editor: Editor<V>): boolean {
    const isNormalizing = NORMALIZING.get(editor)
    return isNormalizing === undefined ? true : isNormalizing
  },

  /**
   * Check if a point is the start point of a location.
   */

  isStart<V extends Value>(
    editor: Editor<V>,
    point: Point,
    at: Location
  ): boolean {
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

  isVoid<V extends Value>(editor: Editor<V>, value: any): value is Element {
    return Element.isElement(value) && editor.isVoid(value as any)
  },

  /**
   * Get the last node at a location.
   */

  last<V extends Value>(
    editor: Editor<V>,
    at: Location
  ): NodeEntry<NodeOf<Editor<V>>> {
    const path = Editor.path(editor, at, { edge: 'end' })
    const node = Editor.node(editor, path)
    return node
  },

  /**
   * Get the leaf text node at a location.
   */

  leaf<V extends Value>(
    editor: Editor<V>,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry<TextOf<Editor<V>>> {
    const path = Editor.path(editor, at, options)
    const node = Node.leaf(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the levels at a location.
   */

  *levels<V extends Value, N extends Node>(
    editor: Editor<V>,
    options: {
      at?: Location
      match?: NodeMatch<N & NodeOf<Editor<V>>>
      reverse?: boolean
      voids?: boolean
    } = {}
  ): Generator<NodeEntry<N & NodeOf<Editor<V>>>, void, undefined> {
    const { at = editor.selection, reverse = false, voids = false } = options
    let { match } = options

    if (match == null) {
      match = () => true
    }

    if (!at) {
      return
    }

    const levels: NodeEntry<N & NodeOf<Editor<V>>>[] = []
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

  marks<V extends Value>(
    editor: Editor<V>
  ): Partial<MarksOf<Editor<V>>> | null {
    let { marks, selection } = editor

    if (!selection) {
      return null
    }

    if (marks) {
      return editor.marks as any
    }

    if (Range.isExpanded(selection)) {
      const [match] = Editor.nodes(editor, { match: Text.isText })

      if (match) {
        const [node] = match as NodeEntry<Text>
        marks = Node.props(node)
        return marks as any
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
          node = prevNode as TextOf<Editor<V>>
        }
      }
    }

    marks = Node.props(node)
    return marks as any
  },

  /**
   * Get the matching node in the branch of the document after a location.
   */

  next<V extends Value, N extends Node>(
    editor: Editor<V>,
    options: {
      at?: Location
      match?: NodeMatch<N & NodeOf<Editor<V>>>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ): NodeEntry<N & NodeOf<Editor<V>>> | undefined {
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
        match = n => parent.children.includes(n as any)
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

  node<V extends Value>(
    editor: Editor<V>,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry<NodeOf<Editor<V>>> {
    const path = Editor.path(editor, at, options)
    const node = Node.get(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the nodes in the Editor.
   */

  *nodes<V extends Value, T extends Node>(
    editor: Editor<V>,
    options: {
      at?: Location | Span
      match?: NodeMatch<T & NodeOf<Editor<V>>>
      mode?: 'all' | 'highest' | 'lowest'
      universal?: boolean
      reverse?: boolean
      voids?: boolean
    } = {}
  ): Generator<NodeEntry<T & NodeOf<Editor<V>>>, void, undefined> {
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

    const matches: NodeEntry<T & NodeOf<Editor<V>>>[] = []
    let hit: NodeEntry<T & NodeOf<Editor<V>>> | undefined

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
      const emit: NodeEntry<T & NodeOf<Editor<V>>> | undefined =
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

  normalize<V extends Value>(
    editor: Editor<V>,
    options: {
      force?: boolean
    } = {}
  ): void {
    const { force = false } = options
    const getDirtyPaths = (editor: Editor<V>) => {
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

  parent<V extends Value>(
    editor: Editor<V>,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry<AncestorOf<Editor<V>>> {
    const path = Editor.path(editor, at, options)
    const parentPath = Path.parent(path)
    const entry = Editor.node(editor, parentPath)
    return entry as NodeEntry<AncestorOf<Editor<V>>>
  },

  /**
   * Get the path of a location.
   */

  path<V extends Value>(
    editor: Editor<V>,
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

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   */

  pathRef<V extends Value>(
    editor: Editor<V>,
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

  pathRefs<V extends Value>(editor: Editor<V>): Set<PathRef> {
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

  point<V extends Value>(
    editor: Editor<V>,
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

  pointRef<V extends Value>(
    editor: Editor<V>,
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

  pointRefs<V extends Value>(editor: Editor<V>): Set<PointRef> {
    let refs = POINT_REFS.get(editor)

    if (!refs) {
      refs = new Set()
      POINT_REFS.set(editor, refs)
    }

    return refs
  },

  /**
   * Iterate through all of the positions in the document where a `Point` can be
   * placed.
   *
   * By default it will move forward by individual offsets at a time,  but you
   * can pass the `unit: 'character'` option to moved forward one character, word,
   * or line at at time.
   *
   * Note: By default void nodes are treated as a single point and iteration
   * will not happen inside their content unless you pass in true for the
   * voids option, then iteration will occur.
   */

  *positions<V extends Value>(
    editor: Editor<V>,
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

    const range = Editor.range(editor, at)
    const [start, end] = Range.edges(range)
    const first = reverse ? end : start
    let string = ''
    let available = 0
    let offset = 0
    let distance: number | null = null
    let isNewBlock = false

    const advance = () => {
      if (distance == null) {
        if (unit === 'character') {
          distance = getCharacterDistance(string)
        } else if (unit === 'word') {
          distance = getWordDistance(string)
        } else if (unit === 'line' || unit === 'block') {
          distance = string.length
        } else {
          distance = 1
        }

        string = string.slice(distance)
      }

      // Add or substract the offset.
      offset = reverse ? offset - distance : offset + distance
      // Subtract the distance traveled from the available text.
      available = available - distance!
      // If the available had room to spare, reset the distance so that it will
      // advance again next time. Otherwise, set it to the overflow amount.
      distance = available >= 0 ? null : 0 - available
    }

    for (const [node, path] of Editor.nodes(editor, { at, reverse, voids })) {
      if (Element.isElement(node)) {
        // Void nodes are a special case, so by default we will always
        // yield their first point. If the voids option is set to true,
        // then we will iterate over their content
        if (!voids && editor.isVoid(node as ElementOf<Editor<V>>)) {
          yield Editor.start(editor, path)
          continue
        }

        if (editor.isInline(node as ElementOf<Editor<V>>)) {
          continue
        }

        if (Editor.hasInlines(editor, node)) {
          const e = Path.isAncestor(path, end.path)
            ? end
            : Editor.end(editor, path)
          const s = Path.isAncestor(path, start.path)
            ? start
            : Editor.start(editor, path)

          const text = Editor.string(editor, { anchor: s, focus: e }, { voids })
          string = reverse ? reverseText(text) : text
          isNewBlock = true
        }
      }

      if (Text.isText(node)) {
        const isFirst = Path.equals(path, first.path)
        available = node.text.length
        offset = reverse ? available : 0

        if (isFirst) {
          available = reverse ? first.offset : available - first.offset
          offset = first.offset
        }

        if (isFirst || isNewBlock || unit === 'offset') {
          yield { path, offset }
        }

        while (true) {
          // If there's no more string and there is no more characters to skip, continue to the next block.
          if (string === '' && distance === null) {
            break
          } else {
            advance()
          }

          // If the available space hasn't overflow, we have another point to
          // yield in the current text node.
          if (available >= 0) {
            yield { path, offset }
          } else {
            break
          }
        }

        isNewBlock = false
      }
    }
  },

  /**
   * Get the matching node in the branch of the document before a location.
   */

  previous<V extends Value, T extends Node>(
    editor: Editor<V>,
    options: {
      at?: Location
      match?: NodeMatch<T & NodeOf<Editor<V>>>
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ): NodeEntry<T & NodeOf<Editor<V>>> | undefined {
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
        match = n => parent.children.includes(n as any)
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

  range<V extends Value>(
    editor: Editor<V>,
    at: Location,
    to?: Location
  ): Range {
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

  rangeRef<V extends Value>(
    editor: Editor<V>,
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

  rangeRefs<V extends Value>(editor: Editor<V>): Set<RangeRef> {
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

  removeMark<V extends Value, M extends MarksOf<Editor<V>>>(
    editor: Editor<V>,
    key: {} extends M ? string : keyof M & string
  ): void {
    editor.removeMark(key)
  },

  /**
   * Get the start point of a location.
   */

  start<V extends Value>(editor: Editor<V>, at: Location): Point {
    return Editor.point(editor, at, { edge: 'start' })
  },

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option
   */

  string<V extends Value>(
    editor: Editor<V>,
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

  unhangRange<V extends Value>(
    editor: Editor<V>,
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

  void<V extends Value>(
    editor: Editor<V>,
    options: {
      at?: Location
      mode?: 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ): NodeEntry<ElementOf<Editor<V>>> | undefined {
    const entry = Editor.above(editor, {
      ...options,
      match: n => Editor.isVoid(editor, n),
    })

    if (entry) {
      return entry as NodeEntry<ElementOf<Editor<V>>>
    }
  },

  /**
   * Call a function, deferring normalization until after it completes.
   */

  withoutNormalizing<V extends Value>(editor: Editor<V>, fn: () => void): void {
    const value = Editor.isNormalizing(editor)
    NORMALIZING.set(editor, false)
    fn()
    NORMALIZING.set(editor, value)
    Editor.normalize(editor)
  },
}

/**
 * The `Selection` interface is a special type of `Range` that can contain extra
 * properties, and can be `null` to mean no selection exists in the editor.
 */

export type Selection = Range | null

/**
 * A helper type for getting the value of an editor.
 */

export type ValueOf<E extends Editor<Value>> = E['children']
