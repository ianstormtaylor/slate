import {
  Ancestor,
  Descendant,
  Element,
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
import { isEditor } from '../editor/is-editor'
import {
  LeafEdge,
  MaximizeMode,
  RangeDirection,
  SelectionMode,
  TextDirection,
  TextUnit,
  TextUnitAdjustment,
} from '../types/types'
import { OmitFirstArg } from '../utils/types'
import { EditorError, SlateErrorType } from './slate-errors'
import { NodeInsertNodesOptions } from './transforms/node'
import {
  TextInsertFragmentOptions,
  TextInsertTextOptions,
} from './transforms/text'

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */
export interface BaseEditor {
  // Core state.

  children: Descendant[]
  errors: EditorError[]
  selection: Selection
  operations: Operation[]
  marks: EditorMarks | null

  /**
   * In "strict" mode, invalid operations will throw errors rather
   * than being ignored. Set it to `false` to handle these errors yourself.
   * @default true
   */
  strict: boolean

  // Overrideable core methods.

  apply: (operation: Operation) => void
  getDirtyPaths: (operation: Operation) => Path[]
  getFragment: () => Descendant[]
  isElementReadOnly: (element: Element) => boolean
  isSelectable: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry, options?: { operation?: Operation }) => void
  onChange: (options?: { operation?: Operation }) => void

  /**
   * The `onError` callback is called anytime an operation has invalid data.
   * If `editor.strict` is set to `true`, these will be thrown as errors.
   * Otherwise, they will be added to the `editor.errors` array and return a recovery value.
   */
  onError: <T extends SlateErrorType>(context: EditorError<T>) => any

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

  // Overrideable core transforms.

  addMark: OmitFirstArg<typeof Editor.addMark>
  collapse: OmitFirstArg<typeof Transforms.collapse>
  delete: OmitFirstArg<typeof Transforms.delete>
  deleteBackward: (unit: TextUnit) => void
  deleteForward: (unit: TextUnit) => void
  deleteFragment: OmitFirstArg<typeof Editor.deleteFragment>
  deselect: OmitFirstArg<typeof Transforms.deselect>
  insertBreak: OmitFirstArg<typeof Editor.insertBreak>
  insertFragment: OmitFirstArg<typeof Transforms.insertFragment>
  insertNode: OmitFirstArg<typeof Editor.insertNode>
  insertNodes: OmitFirstArg<typeof Transforms.insertNodes>
  insertSoftBreak: OmitFirstArg<typeof Editor.insertSoftBreak>
  insertText: OmitFirstArg<typeof Transforms.insertText>
  liftNodes: OmitFirstArg<typeof Transforms.liftNodes>
  mergeNodes: OmitFirstArg<typeof Transforms.mergeNodes>
  move: OmitFirstArg<typeof Transforms.move>
  moveNodes: OmitFirstArg<typeof Transforms.moveNodes>
  normalize: OmitFirstArg<typeof Editor.normalize>
  removeMark: OmitFirstArg<typeof Editor.removeMark>
  removeNodes: OmitFirstArg<typeof Transforms.removeNodes>
  select: OmitFirstArg<typeof Transforms.select>
  setNodes: <T extends Node>(
    props: Partial<T>,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
      compare?: PropsCompare
      merge?: PropsMerge
    }
  ) => void
  setNormalizing: OmitFirstArg<typeof Editor.setNormalizing>
  setPoint: OmitFirstArg<typeof Transforms.setPoint>
  setSelection: OmitFirstArg<typeof Transforms.setSelection>
  splitNodes: OmitFirstArg<typeof Transforms.splitNodes>
  unsetNodes: OmitFirstArg<typeof Transforms.unsetNodes>
  unwrapNodes: OmitFirstArg<typeof Transforms.unwrapNodes>
  withoutNormalizing: OmitFirstArg<typeof Editor.withoutNormalizing>
  wrapNodes: OmitFirstArg<typeof Transforms.wrapNodes>

  // Overrideable core queries.

  above: <T extends Ancestor>(
    options?: EditorAboveOptions<T>
  ) => NodeEntry<T> | undefined
  after: OmitFirstArg<typeof Editor.after>
  before: OmitFirstArg<typeof Editor.before>
  edges: OmitFirstArg<typeof Editor.edges>
  elementReadOnly: OmitFirstArg<typeof Editor.elementReadOnly>
  end: OmitFirstArg<typeof Editor.end>
  first: OmitFirstArg<typeof Editor.first>
  fragment: OmitFirstArg<typeof Editor.fragment>
  getMarks: OmitFirstArg<typeof Editor.marks>
  hasBlocks: OmitFirstArg<typeof Editor.hasBlocks>
  hasInlines: OmitFirstArg<typeof Editor.hasInlines>
  hasPath: OmitFirstArg<typeof Editor.hasPath>
  hasTexts: OmitFirstArg<typeof Editor.hasTexts>
  isBlock: OmitFirstArg<typeof Editor.isBlock>
  isEdge: OmitFirstArg<typeof Editor.isEdge>
  isEmpty: OmitFirstArg<typeof Editor.isEmpty>
  isEnd: OmitFirstArg<typeof Editor.isEnd>
  isInline: OmitFirstArg<typeof Editor.isInline>
  isNormalizing: OmitFirstArg<typeof Editor.isNormalizing>
  isStart: OmitFirstArg<typeof Editor.isStart>
  isVoid: OmitFirstArg<typeof Editor.isVoid>
  last: OmitFirstArg<typeof Editor.last>
  leaf: OmitFirstArg<typeof Editor.leaf>
  levels: <T extends Node>(
    options?: EditorLevelsOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  next: <T extends Descendant>(
    options?: EditorNextOptions<T>
  ) => NodeEntry<T> | undefined
  node: OmitFirstArg<typeof Editor.node>
  nodes: <T extends Node>(
    options?: EditorNodesOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>
  parent: OmitFirstArg<typeof Editor.parent>
  path: OmitFirstArg<typeof Editor.path>
  pathRef: OmitFirstArg<typeof Editor.pathRef>
  pathRefs: OmitFirstArg<typeof Editor.pathRefs>
  point: OmitFirstArg<typeof Editor.point>
  pointRef: OmitFirstArg<typeof Editor.pointRef>
  pointRefs: OmitFirstArg<typeof Editor.pointRefs>
  positions: OmitFirstArg<typeof Editor.positions>
  previous: <T extends Node>(
    options?: EditorPreviousOptions<T>
  ) => NodeEntry<T> | undefined
  range: OmitFirstArg<typeof Editor.range>
  rangeRef: OmitFirstArg<typeof Editor.rangeRef>
  rangeRefs: OmitFirstArg<typeof Editor.rangeRefs>
  start: OmitFirstArg<typeof Editor.start>
  string: OmitFirstArg<typeof Editor.string>
  unhangRange: OmitFirstArg<typeof Editor.unhangRange>
  void: OmitFirstArg<typeof Editor.void>
}

export type Editor = ExtendedType<'Editor', BaseEditor>

export type BaseSelection = Range | null

export type Selection = ExtendedType<'Selection', BaseSelection>

export type EditorMarks = Omit<Text, 'text'>

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
  /**
   * Get the ancestor above a location in the document.
   */
  above: <T extends Ancestor>(
    editor: Editor,
    options?: EditorAboveOptions<T>
  ) => NodeEntry<T> | undefined

  /**
   * Add a custom property to the leaf text nodes in the current selection.
   *
   * If the selection is currently collapsed, the marks will be added to the
   * `editor.marks` property instead, and applied when text is inserted next.
   */
  addMark: (editor: Editor, key: string, value: any) => void

  /**
   * Get the point after a location.
   */
  after: (
    editor: Editor,
    at: Location,
    options?: EditorAfterOptions
  ) => Point | undefined

  /**
   * Get the point before a location.
   */
  before: (
    editor: Editor,
    at: Location,
    options?: EditorBeforeOptions
  ) => Point | undefined

  /**
   * Delete content in the editor backward from the current selection.
   */
  deleteBackward: (
    editor: Editor,
    options?: EditorDirectedDeletionOptions
  ) => void

  /**
   * Delete content in the editor forward from the current selection.
   */
  deleteForward: (
    editor: Editor,
    options?: EditorDirectedDeletionOptions
  ) => void

  /**
   * Delete the content in the current selection.
   */
  deleteFragment: (
    editor: Editor,
    options?: EditorFragmentDeletionOptions
  ) => void

  /**
   * Get the start and end points of a location.
   */
  edges: (
    editor: Editor,
    at: Location
  ) => [Point | undefined, Point | undefined]

  /**
   * Match a read-only element in the current branch of the editor.
   */
  elementReadOnly: (
    editor: Editor,
    options?: EditorElementReadOnlyOptions
  ) => NodeEntry<Element> | undefined

  /**
   * Get the end point of a location.
   */
  end: (editor: Editor, at: Location) => Point | undefined

  /**
   * Get the first node at a location.
   */
  first: (editor: Editor, at: Location) => NodeEntry | undefined

  /**
   * Get the fragment at a location.
   */
  fragment: (editor: Editor, at: Location) => Descendant[]

  /**
   * Check if a node has block children.
   */
  hasBlocks: (editor: Editor, element: Element) => boolean

  /**
   * Check if a node has inline and text children.
   */
  hasInlines: (editor: Editor, element: Element) => boolean

  hasPath: (editor: Editor, path: Path) => boolean

  /**
   * Check if a node has text children.
   */
  hasTexts: (editor: Editor, element: Element) => boolean

  /**
   * Insert a block break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertBreak: (editor: Editor) => void

  /**
   * Inserts a fragment
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   */
  insertFragment: (
    editor: Editor,
    fragment: Node[],
    options?: TextInsertFragmentOptions
  ) => void

  /**
   * Atomically inserts `nodes`
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   */
  insertNode: <T extends Node>(
    editor: Editor,
    node: Node,
    options?: NodeInsertNodesOptions<T>
  ) => void

  /**
   * Insert a soft break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertSoftBreak: (editor: Editor) => void

  /**
   * Insert a string of text
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   */
  insertText: (
    editor: Editor,
    text: string,
    options?: TextInsertTextOptions
  ) => void

  /**
   * Check if a value is a block `Element` object.
   */
  isBlock: (editor: Editor, value: Element) => boolean

  /**
   * Check if a point is an edge of a location.
   */
  isEdge: (editor: Editor, point: Point, at: Location) => boolean

  /**
   * Check if a value is an `Editor` object.
   */
  isEditor: (value: any) => value is Editor

  /**
   * Check if a value is a read-only `Element` object.
   */
  isElementReadOnly: (editor: Editor, element: Element) => boolean

  /**
   * Check if an element is empty, accounting for void nodes.
   */
  isEmpty: (editor: Editor, element: Element) => boolean

  /**
   * Check if a point is the end point of a location.
   */
  isEnd: (editor: Editor, point: Point, at: Location) => boolean

  /**
   * Check if a value is an inline `Element` object.
   */
  isInline: (editor: Editor, value: Element) => boolean

  /**
   * Check if the editor is currently normalizing after each operation.
   */
  isNormalizing: (editor: Editor) => boolean

  /**
   * Check if a value is a selectable `Element` object.
   */
  isSelectable: (editor: Editor, element: Element) => boolean

  /**
   * Check if a point is the start point of a location.
   */
  isStart: (editor: Editor, point: Point, at: Location) => boolean

  /**
   * Check if a value is a void `Element` object.
   */
  isVoid: (editor: Editor, value: Element) => boolean

  /**
   * Get the last node at a location.
   */
  last: (editor: Editor, at: Location) => NodeEntry | undefined

  /**
   * Get the leaf text node at a location.
   */
  leaf: (
    editor: Editor,
    at: Location,
    options?: EditorLeafOptions
  ) => NodeEntry<Text> | undefined

  /**
   * Iterate through all of the levels at a location.
   */
  levels: <T extends Node>(
    editor: Editor,
    options?: EditorLevelsOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>

  /**
   * Get the marks that would be added to text at the current selection.
   */
  marks: (editor: Editor) => Omit<Text, 'text'> | null

  /**
   * Get the matching node in the branch of the document after a location.
   */
  next: <T extends Descendant>(
    editor: Editor,
    options?: EditorNextOptions<T>
  ) => NodeEntry<T> | undefined

  /**
   * Get the node at a location.
   */
  node: (
    editor: Editor,
    at: Location,
    options?: EditorNodeOptions
  ) => NodeEntry | undefined

  /**
   * Iterate through all of the nodes in the Editor.
   */
  nodes: <T extends Node>(
    editor: Editor,
    options?: EditorNodesOptions<T>
  ) => Generator<NodeEntry<T>, void, undefined>

  /**
   * Normalize any dirty objects in the editor.
   */
  normalize: (editor: Editor, options?: EditorNormalizeOptions) => void

  /**
   * Get the parent node of a location.
   */
  parent: (
    editor: Editor,
    at: Location,
    options?: EditorParentOptions
  ) => NodeEntry<Ancestor> | undefined

  /**
   * Get the path of a location.
   */
  path: (
    editor: Editor,
    at: Location,
    options?: EditorPathOptions
  ) => Path | undefined

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  pathRef: (
    editor: Editor,
    path: Path,
    options?: EditorPathRefOptions
  ) => PathRef

  /**
   * Get the set of currently tracked path refs of the editor.
   */
  pathRefs: (editor: Editor) => Set<PathRef>

  /**
   * Get the start or end point of a location.
   */
  point: (
    editor: Editor,
    at: Location,
    options?: EditorPointOptions
  ) => Point | undefined

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  pointRef: (
    editor: Editor,
    point: Point,
    options?: EditorPointRefOptions
  ) => PointRef

  /**
   * Get the set of currently tracked point refs of the editor.
   */
  pointRefs: (editor: Editor) => Set<PointRef>

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
  positions: (
    editor: Editor,
    options?: EditorPositionsOptions
  ) => Generator<Point, void, undefined>

  /**
   * Get the matching node in the branch of the document before a location.
   */
  previous: <T extends Node>(
    editor: Editor,
    options?: EditorPreviousOptions<T>
  ) => NodeEntry<T> | undefined

  /**
   * Get a range of a location.
   */
  range: (editor: Editor, at: Location, to?: Location) => Range | undefined

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  rangeRef: (
    editor: Editor,
    range: Range,
    options?: EditorRangeRefOptions
  ) => RangeRef

  /**
   * Get the set of currently tracked range refs of the editor.
   */
  rangeRefs: (editor: Editor) => Set<RangeRef>

  /**
   * Remove a custom property from all of the leaf text nodes in the current
   * selection.
   *
   * If the selection is currently collapsed, the removal will be stored on
   * `editor.marks` and applied to the text inserted next.
   */
  removeMark: (editor: Editor, key: string) => void

  /**
   * Manually set if the editor should currently be normalizing.
   *
   * Note: Using this incorrectly can leave the editor in an invalid state.
   *
   */
  setNormalizing: (editor: Editor, isNormalizing: boolean) => void

  /**
   * Get the start point of a location.
   */
  start: (editor: Editor, at: Location) => Point | undefined

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option
   */
  string: (
    editor: Editor,
    at: Location,
    options?: EditorStringOptions
  ) => string

  /**
   * Convert a range into a non-hanging one.
   */
  unhangRange: (
    editor: Editor,
    range: Range,
    options?: EditorUnhangRangeOptions
  ) => Range

  /**
   * Match a void node in the current branch of the editor.
   */
  void: (
    editor: Editor,
    options?: EditorVoidOptions
  ) => NodeEntry<Element> | undefined

  /**
   * Call a function, deferring normalization until after it completes.
   */
  withoutNormalizing: (editor: Editor, fn: () => void) => void
}

// eslint-disable-next-line no-redeclare
export const Editor: EditorInterface = {
  above(editor, options) {
    return editor.above(options)
  },

  addMark(editor, key, value) {
    editor.addMark(key, value)
  },

  after(editor, at, options) {
    return editor.after(at, options)
  },

  before(editor, at, options) {
    return editor.before(at, options)
  },

  deleteBackward(editor, options = {}) {
    const { unit = 'character' } = options
    editor.deleteBackward(unit)
  },

  deleteForward(editor, options = {}) {
    const { unit = 'character' } = options
    editor.deleteForward(unit)
  },

  deleteFragment(editor, options) {
    editor.deleteFragment(options)
  },

  edges(editor, at) {
    return editor.edges(at)
  },

  elementReadOnly(editor: Editor, options: EditorElementReadOnlyOptions = {}) {
    return editor.elementReadOnly(options)
  },

  end(editor, at) {
    return editor.end(at)
  },

  first(editor, at) {
    return editor.first(at)
  },

  fragment(editor, at) {
    return editor.fragment(at)
  },

  hasBlocks(editor, element) {
    return editor.hasBlocks(element)
  },

  hasInlines(editor, element) {
    return editor.hasInlines(element)
  },

  hasPath(editor, path) {
    return editor.hasPath(path)
  },

  hasTexts(editor, element) {
    return editor.hasTexts(element)
  },

  insertBreak(editor) {
    editor.insertBreak()
  },

  insertFragment(editor, fragment, options) {
    editor.insertFragment(fragment, options)
  },

  insertNode(editor, node) {
    editor.insertNode(node)
  },

  insertSoftBreak(editor) {
    editor.insertSoftBreak()
  },

  insertText(editor, text) {
    editor.insertText(text)
  },

  isBlock(editor, value) {
    return editor.isBlock(value)
  },

  isEdge(editor, point, at) {
    return editor.isEdge(point, at)
  },

  isEditor(value: any): value is Editor {
    return isEditor(value)
  },

  isElementReadOnly(editor, element) {
    return editor.isElementReadOnly(element)
  },

  isEmpty(editor, element) {
    return editor.isEmpty(element)
  },

  isEnd(editor, point, at) {
    return editor.isEnd(point, at)
  },

  isInline(editor, value) {
    return editor.isInline(value)
  },

  isNormalizing(editor) {
    return editor.isNormalizing()
  },

  isSelectable(editor: Editor, value: Element) {
    return editor.isSelectable(value)
  },

  isStart(editor, point, at) {
    return editor.isStart(point, at)
  },

  isVoid(editor, value) {
    return editor.isVoid(value)
  },

  last(editor, at) {
    return editor.last(at)
  },

  leaf(editor, at, options) {
    return editor.leaf(at, options)
  },

  levels(editor, options) {
    return editor.levels(options)
  },

  marks(editor) {
    return editor.getMarks()
  },

  next<T extends Descendant>(
    editor: Editor,
    options?: EditorNextOptions<T>
  ): NodeEntry<T> | undefined {
    return editor.next(options)
  },

  node(editor, at, options) {
    return editor.node(at, options)
  },

  nodes(editor, options) {
    return editor.nodes(options)
  },

  normalize(editor, options) {
    editor.normalize(options)
  },

  parent(editor, at, options) {
    return editor.parent(at, options)
  },

  path(editor, at, options) {
    return editor.path(at, options)
  },

  pathRef(editor, path, options) {
    return editor.pathRef(path, options)
  },

  pathRefs(editor) {
    return editor.pathRefs()
  },

  point(editor, at, options) {
    return editor.point(at, options)
  },

  pointRef(editor, point, options) {
    return editor.pointRef(point, options)
  },

  pointRefs(editor) {
    return editor.pointRefs()
  },

  positions(editor, options) {
    return editor.positions(options)
  },

  previous(editor, options) {
    return editor.previous(options)
  },

  range(editor, at, to) {
    return editor.range(at, to)
  },

  rangeRef(editor, range, options) {
    return editor.rangeRef(range, options)
  },

  rangeRefs(editor) {
    return editor.rangeRefs()
  },

  removeMark(editor, key) {
    editor.removeMark(key)
  },

  setNormalizing(editor, isNormalizing) {
    editor.setNormalizing(isNormalizing)
  },

  start(editor, at) {
    return editor.start(at)
  },

  string(editor, at, options) {
    return editor.string(at, options)
  },

  unhangRange(editor, range, options) {
    return editor.unhangRange(range, options)
  },

  void(editor, options) {
    return editor.void(options)
  },

  withoutNormalizing(editor, fn: () => void) {
    editor.withoutNormalizing(fn)
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
