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
import {
  LeafEdge,
  MaximizeMode,
  RangeDirection,
  RangeMode,
  SelectionMode,
  TextDirection,
  TextUnit,
  TextUnitAdjustment,
} from '../types/types'
import { isEditor } from '../editor/is-editor'
import {
  TextDeleteOptions,
  TextInsertFragmentOptions,
  TextInsertTextOptions,
} from './transforms/text'
import { NodeInsertNodesOptions } from './transforms/node'
import {
  SelectionCollapseOptions,
  SelectionMoveOptions,
  SelectionSetPointOptions,
} from './transforms/selection'

/**
 * The `Editor` interface stores all the state of a Slate editor. It is extended
 * by plugins that wish to add their own helpers and implement new behaviors.
 */
export interface BaseEditor {
  // Core state.
  children: Descendant[]
  selection: Selection
  operations: Operation[]
  marks: EditorMarks | null

  // Overrideable core methods.

  /** Apply an operation in the editor. */
  apply(operation: Operation): void

  getDirtyPaths(operation: Operation): Path[]

  /** Returns the fragment at the current selection. Used when cutting or copying, as an example, to get the fragment at the current selection. */
  getFragment(): Descendant[]

  /**
   * Check if a value is a read-only `Element` object.
   * @see {@link EditorInterface#isElementReadOnly} - A static version of this method.
   */
  isElementReadOnly(element: Element): boolean

  /**
   * Check if a value is a selectable `Element` object.
   * @see {@link EditorInterface#isSelectable} - A static version of this method.
   */
  isSelectable(element: Element): boolean

  /**
   * Tells which void nodes accept marks. Slate's default implementation
   * returns `false`, but if some void elements support formatting, override
   * this function to include them.
   */
  markableVoid(element: Element): boolean

  /**
   * Normalize a node according to the schema.
   * @see {@link EditorInterface#normalize} - A static version of this method.
   */
  normalizeNode(
    entry: NodeEntry,
    options?: {
      operation?: Operation
      fallbackElement?: () => Element
    }
  ): void

  /** Called when there is a change in the editor. */
  onChange(options?: { operation?: Operation }): void

  /**
   * Override this method to prevent normalizing the editor.
   * @see {@link EditorInterface#isNormalizing} - A static version of this method.
   */
  shouldNormalize({
    iteration,
    dirtyPaths,
    operation,
  }: {
    iteration: number
    initialDirtyPathsLength: number
    dirtyPaths: Path[]
    operation?: Operation
  }): boolean

  // Overrideable core transforms.

  /**
   * Add a custom property to the leaf text nodes within non-void nodes or void
   * nodes that `editor.markableVoid()` allows in the current selection. If the
   * selection is currently collapsed, the marks will be added to the
   * `editor.marks` property instead, and applied when text is inserted next.
   * @see {@link EditorInterface#addMark} - A static version of this method.
   */
  addMark(key: string, value: any): void

  /**
   * Collapse the selection.
   * @see {@link TransformsInterface#collapse} - A static version of this method.
   */
  collapse(options?: SelectionCollapseOptions): void

  /**
   * Delete content in the editor.
   * @see {@link TransformsInterface#delete} - A static version of this method.
   */
  delete(options?: TextDeleteOptions): void

  /**
   * Delete content in the editor backward from the current selection.
   * @see {@link EditorInterface#deleteBackward} - A static version of this method.
   */
  deleteBackward(unit: TextUnit): void

  /**
   * Delete content in the editor forward from the current selection.
   * @see {@link EditorInterface#deleteForward} - A static version of this method.
   */
  deleteForward(unit: TextUnit): void

  /**
   * Delete the content of the current selection.
   * @see {@link EditorInterface#deleteFragment} - A static version of this method.
   */
  deleteFragment(options?: EditorFragmentDeletionOptions): void

  /**
   * Unset the selection.
   * @see {@link TransformsInterface#deselect} - A static version of this method.
   */
  deselect(): void

  /**
   * Insert a block break at the current selection. If the selection is
   * currently expanded, delete it first.
   * @see {@link EditorInterface#insertBreak} - A static version of this method.
   */
  insertBreak(): void

  /**
   * Insert a fragment at the current selection. If the selection is currently
   * expanded, delete it first.
   * @see {@link EditorInterface#insertFragment} - A static version of this method.
   */
  insertFragment(fragment: Node[], options?: TextInsertFragmentOptions): void

  /**
   * Insert a node at the current selection. If the selection is currently
   * expanded, delete it first.
   *
   * **WARNING**: Inserting a node that already exists in the document (or another active document) can cause problems with certain plugins like `slate-dom` and `slate-react` that expect each node to be a unique object.
   * @see {@link EditorInterface#insertNode} - A static version of this method.
   */
  insertNode<T extends Node>(
    node: Node,
    options?: NodeInsertNodesOptions<T>
  ): void

  /**
   * Insert nodes in the editor at the specified location or (if not defined)
   * the current selection or (if not defined) the end of the document.
   *
   * **WARNING**: Inserting a node that already exists in the document (or another active document) can cause problems with certain plugins like `slate-dom` and `slate-react` that expect each node to be a unique object.
   * @see {@link TransformsInterface#insertNodes} - A static version of this method.
   */
  insertNodes<T extends Node>(
    nodes: Node | Node[],
    options?: NodeInsertNodesOptions<T>
  ): void

  /**
   * Insert a soft break at the current selection. If the selection is
   * currently expanded, delete it first.
   * @see {@link EditorInterface#insertSoftBreak} - A static version of this method.
   */
  insertSoftBreak(): void

  /**
   * Insert text at the current selection. If the selection is currently
   * expanded, delete it first.
   * @see {@link EditorInterface#insertText} - A static version of this method.
   */
  insertText(text: string, options?: TextInsertTextOptions): void

  /**
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   * @see {@link TransformsInterface#liftNodes} - A static version of this method.
   */
  liftNodes<T extends Node>(options?: {
    at?: Location
    match?: NodeMatch<T>
    mode?: MaximizeMode
    voids?: boolean
  }): void

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   * @see {@link TransformsInterface#mergeNodes} - A static version of this method.
   */
  mergeNodes<T extends Node>(options?: {
    at?: Location
    match?: NodeMatch<T>
    mode?: RangeMode
    hanging?: boolean
    voids?: boolean
  }): void

  /**
   * Move the selection's point forward or backward.
   * @see {@link TransformsInterface#move} - A static version of this method.
   */
  move(options?: SelectionMoveOptions): void

  /**
   * Move the nodes at a location to a new location.
   * @see {@link TransformsInterface#moveNodes} - A static version of this method.
   */
  moveNodes<T extends Node>(options: {
    at?: Location
    match?: NodeMatch<T>
    mode?: MaximizeMode
    to: Path
    voids?: boolean
  }): void

  /**
   * Normalize any dirty objects in the editor.
   * @see {@link EditorInterface#normalize} - A static version of this method.
   */
  normalize(options?: EditorNormalizeOptions): void

  /**
   * Remove a custom property from the leaf text nodes within non-void nodes
   * or void nodes that `editor.markableVoid()` allows in the current
   * selection. If the selection is currently collapsed, the removal will be
   * stored on `editor.marks` and applied to the text inserted next.
   * @see {@link EditorInterface#removeMark} - A static version of this method.
   */
  removeMark(key: string): void

  /**
   * Remove the nodes at a specific location in the document.
   * @see {@link TransformsInterface#removeNodes} - A static version of this method.
   */
  removeNodes<T extends Node>(options?: {
    at?: Location
    match?: NodeMatch<T>
    mode?: RangeMode
    hanging?: boolean
    voids?: boolean
  }): void

  /**
   * Set the selection to a new value.
   * @see {@link TransformsInterface#select} - A static version of this method.
   */
  select(target: Location): void

  /**
   * Set new properties on the nodes at a location.
   * @see {@link TransformsInterface#setNodes} - A static version of this method.
   */
  setNodes<T extends Node>(
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
  ): void

  /**
   * Manually set if the editor should currently be normalizing.
   *
   * Note: Using this incorrectly can leave the editor in an invalid state.
   * @see {@link EditorInterface#setNormalizing} - A static version of this method.
   */
  setNormalizing(isNormalizing: boolean): void

  /**
   * Set new properties on one of the selection's points.
   * @see {@link TransformsInterface#setPoint} - A static version of this method.
   */
  setPoint(props: Partial<Point>, options?: SelectionSetPointOptions): void

  /**
   * Set new properties on the selection.
   * @see {@link TransformsInterface#setSelection} - A static version of this method.
   */
  setSelection(props: Partial<Range>): void

  /**
   * Split the nodes at a specific location.
   * @see {@link TransformsInterface#splitNodes} - A static version of this method.
   */
  splitNodes<T extends Node>(options?: {
    at?: Location
    match?: NodeMatch<T>
    mode?: RangeMode
    always?: boolean
    height?: number
    voids?: boolean
  }): void

  /**
   * Unset properties on the nodes at a location.
   * @see {@link TransformsInterface#unsetNodes} - A static version of this method.
   */
  unsetNodes<T extends Node>(
    props: string | string[],
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      hanging?: boolean
      split?: boolean
      voids?: boolean
    }
  ): void

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent
   * if necessary to ensure that only the content in the range is unwrapped.
   * @see {@link TransformsInterface#unwrapNodes} - A static version of this method.
   */
  unwrapNodes<T extends Node>(options?: {
    at?: Location
    match?: NodeMatch<T>
    mode?: MaximizeMode
    split?: boolean
    voids?: boolean
  }): void

  /**
   * Call a function, deferring normalization until after it completes.
   * @see {@link EditorInterface#withoutNormalizing} - A static version of this method.
   */
  withoutNormalizing(fn: () => void): void

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   * @see {@link TransformsInterface#wrapNodes} - A static version of this method.
   */
  wrapNodes<T extends Node>(
    element: Element,
    options?: {
      at?: Location
      match?: NodeMatch<T>
      mode?: MaximizeMode
      split?: boolean
      voids?: boolean
    }
  ): void

  // Overrideable core queries.

  /**
   * Get the ancestor above a location in the document.
   * @see {@link EditorInterface#above} - A static version of this method.
   */
  above<T extends Ancestor>(
    options?: EditorAboveOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Get the point after a location.
   * @see {@link EditorInterface#after} - A static version of this method.
   */
  after(at: Location, options?: EditorAfterOptions): Point | undefined

  /**
   * Get the point before a location.
   * @see {@link EditorInterface#before} - A static version of this method.
   */
  before(at: Location, options?: EditorBeforeOptions): Point | undefined

  /**
   * Get the start and end points of a location.
   * @see {@link EditorInterface#edges} - A static version of this method.
   */
  edges(at: Location): [Point, Point]

  /**
   * Match a read-only element in the current branch of the editor.
   * @see {@link EditorInterface#elementReadOnly} - A static version of this method.
   */
  elementReadOnly(
    options?: EditorElementReadOnlyOptions
  ): NodeEntry<Element> | undefined

  /**
   * Get the end point of a location.
   * @see {@link EditorInterface#end} - A static version of this method.
   */
  end(at: Location): Point

  /**
   * Get the first node at a location.
   * @see {@link EditorInterface#first} - A static version of this method.
   */
  first(at: Location): NodeEntry

  /**
   * Get the fragment at a location.
   * @see {@link EditorInterface#fragment} - A static version of this method.
   */
  fragment(at: Location): Descendant[]

  /**
   * Get the marks that would be added to text at the current selection.
   * @see {@link EditorInterface#marks} - A static version of this method.
   */
  getMarks(): Omit<Text, 'text'> | null

  /**
   * Check if a node has block children.
   * @see {@link EditorInterface#hasBlocks} - A static version of this method.
   */
  hasBlocks(element: Element): boolean

  /**
   * Check if a node has inline and text children.
   * @see {@link EditorInterface#hasInlines} - A static version of this method.
   */
  hasInlines(element: Element): boolean

  /**
   * @see {@link EditorInterface#hasPath} - A static version of this method.
   */
  hasPath(path: Path): boolean

  /**
   * Check if a node has text children.
   * @see {@link EditorInterface#hasTexts} - A static version of this method.
   */
  hasTexts(element: Element): boolean

  /**
   * Check if a value is a block `Element` object.
   * @see {@link EditorInterface#isBlock} - A static version of this method.
   */
  isBlock(value: Element): boolean

  /**
   * Check if a point is an edge of a location.
   * @see {@link EditorInterface#isEdge} - A static version of this method.
   */
  isEdge(point: Point, at: Location): boolean

  /**
   * Check if an element is empty, accounting for void nodes.
   * @see {@link EditorInterface#isEmpty} - A static version of this method.
   */
  isEmpty(element: Element): boolean

  /**
   * Check if a point is the end point of a location.
   * @see {@link EditorInterface#isEnd} - A static version of this method.
   */
  isEnd(point: Point, at: Location): boolean

  /**
   * Check if a value is an inline `Element` object.
   * @see {@link EditorInterface#isInline} - A static version of this method.
   */
  isInline(value: Element): boolean

  /**
   * Check if the editor is currently normalizing after each operation.
   * @see {@link EditorInterface#isNormalizing} - A static version of this method.
   */
  isNormalizing(): boolean

  /**
   * Check if a point is the start point of a location.
   * @see {@link EditorInterface#isStart} - A static version of this method.
   */
  isStart(point: Point, at: Location): boolean

  /**
   * Check if a value is a void `Element` object.
   * @see {@link EditorInterface#isVoid} - A static version of this method.
   */
  isVoid(value: Element): boolean

  /**
   * Get the last node at a location.
   * @see {@link EditorInterface#last} - A static version of this method.
   */
  last(at: Location): NodeEntry

  /**
   * Get the leaf text node at a location.
   * @see {@link EditorInterface#leaf} - A static version of this method.
   */
  leaf(at: Location, options?: EditorLeafOptions): NodeEntry<Text>

  /**
   * Iterate through all of the levels at a location.
   * @see {@link EditorInterface#levels} - A static version of this method.
   */
  levels<T extends Node>(
    options?: EditorLevelsOptions<T>
  ): Generator<NodeEntry<T>, void, undefined>

  /**
   * Get the matching node in the branch of the document after a location.
   * @see {@link EditorInterface#next} - A static version of this method.
   */
  next<T extends Descendant>(
    options?: EditorNextOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Get the node at a location.
   * @see {@link EditorInterface#node} - A static version of this method.
   */
  node(at: Location, options?: EditorNodeOptions): NodeEntry

  /**
   * Iterate through all of the nodes in the Editor.
   * @see {@link EditorInterface#nodes} - A static version of this method.
   */
  nodes<T extends Node>(
    options?: EditorNodesOptions<T>
  ): Generator<NodeEntry<T>, void, undefined>

  /**
   * Get the parent node of a location.
   * @see {@link EditorInterface#parent} - A static version of this method.
   */
  parent(at: Location, options?: EditorParentOptions): NodeEntry<Ancestor>

  /**
   * Get the path of a location.
   * @see {@link EditorInterface#path} - A static version of this method.
   */
  path(at: Location, options?: EditorPathOptions): Path

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   * @see {@link EditorInterface#pathRef} - A static version of this method.
   */
  pathRef(path: Path, options?: EditorPathRefOptions): PathRef

  /**
   * Get the set of currently tracked path refs of the editor.
   * @see {@link EditorInterface#pathRefs} - A static version of this method.
   */
  pathRefs(): Set<PathRef>

  /**
   * Get the start or end point of a location.
   * @see {@link EditorInterface#point} - A static version of this method.
   */
  point(at: Location, options?: EditorPointOptions): Point

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the editor.
   * @see {@link EditorInterface#pointRef} - A static version of this method.
   */
  pointRef(point: Point, options?: EditorPointRefOptions): PointRef

  /**
   * Get the set of currently tracked point refs of the editor.
   * @see {@link EditorInterface#pointRefs} - A static version of this method.
   */
  pointRefs(): Set<PointRef>

  /**
   * Return all the positions in `at` range where a `Point` can be placed.
   * @see {@link EditorInterface#positions} - A static version of this method.
   */
  positions(options?: EditorPositionsOptions): Generator<Point, void, undefined>

  /**
   * Get the matching node in the branch of the document before a location.
   * @see {@link EditorInterface#previous} - A static version of this method.
   */
  previous<T extends Node>(
    options?: EditorPreviousOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Get a range of a location.
   * @see {@link EditorInterface#range} - A static version of this method.
   */
  range(at: Location, to?: Location): Range

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the editor.
   * @see {@link EditorInterface#rangeRef} - A static version of this method.
   */
  rangeRef(range: Range, options?: EditorRangeRefOptions): RangeRef

  /**
   * Get the set of currently tracked range refs of the editor.
   * @see {@link EditorInterface#rangeRefs} - A static version of this method.
   */
  rangeRefs(): Set<RangeRef>

  /**
   * Get the start point of a location.
   * @see {@link EditorInterface#start} - A static version of this method.
   */
  start(at: Location): Point

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option.
   * @see {@link EditorInterface#string} - A static version of this method.
   */
  string(at: Location, options?: EditorStringOptions): string

  /**
   * Convert a range into a non-hanging one.
   * @see {@link EditorInterface#unhangRange} - A static version of this method.
   */
  unhangRange(range: Range, options?: EditorUnhangRangeOptions): Range

  /**
   * Match a void node in the current branch of the editor.
   * @see {@link EditorInterface#void} - A static version of this method.
   */
  void(options?: EditorVoidOptions): NodeEntry<Element> | undefined

  /**
   * Determine whether or not to remove the previous node when merging.
   * @see {@link EditorInterface#shouldMergeNodesRemovePrevNode} - A static version of this method.
   */
  shouldMergeNodesRemovePrevNode(
    prevNodeEntry: NodeEntry,
    curNodeEntry: NodeEntry
  ): boolean
}

export type Editor = ExtendedType<'Editor', BaseEditor>

export type BaseSelection = Range | null

export type Selection = ExtendedType<'Selection', BaseSelection>

export type EditorMarks = Omit<Text, 'text'>

/** @inline */
export interface EditorAboveOptions<T extends Ancestor> {
  at?: Location
  match?: NodeMatch<T>
  mode?: MaximizeMode
  voids?: boolean
}

/** @inline */
export interface EditorAfterOptions {
  distance?: number
  unit?: TextUnitAdjustment
  voids?: boolean
}

/** @inline */
export interface EditorBeforeOptions {
  distance?: number
  unit?: TextUnitAdjustment
  voids?: boolean
}

/** @inline */
export interface EditorDirectedDeletionOptions {
  unit?: TextUnit
}

/** @inline */
export interface EditorElementReadOnlyOptions {
  at?: Location
  mode?: MaximizeMode
  voids?: boolean
}

/** @inline */
export interface EditorFragmentDeletionOptions {
  direction?: TextDirection
}

/** @inline */
export interface EditorIsEditorOptions {
  deep?: boolean
}

/** @inline */
export interface EditorLeafOptions {
  depth?: number
  edge?: LeafEdge
}

/** @inline */
export interface EditorLevelsOptions<T extends Node> {
  at?: Location
  match?: NodeMatch<T>
  reverse?: boolean
  voids?: boolean
}

/** @inline */
export interface EditorNextOptions<T extends Descendant> {
  at?: Location
  match?: NodeMatch<T>
  mode?: SelectionMode
  voids?: boolean
}

/** @inline */
export interface EditorNodeOptions {
  depth?: number
  edge?: LeafEdge
}

/** @inline */
export interface EditorNodesOptions<T extends Node> {
  /**
   * The location to iterate over.
   * @default The current selection. If there is no selection, nothing is yielded.
   */
  at?: Location | Span
  /** Provide a predicate to the `match?` option to limit the `NodeEntry` objects that are returned. */
  match?: NodeMatch<T>
  /**
   * - `'all'` (default): Return all matching nodes
   * - `'highest'`: in a hierarchy of nodes, only return the highest level matching nodes
   * - `'lowest'`: in a hierarchy of nodes, only return the lowest level matching nodes
   */
  mode?: SelectionMode
  universal?: boolean
  reverse?: boolean
  voids?: boolean
  /** Skip the descendants of certain nodes (but not the nodes themselves). */
  pass?: (entry: NodeEntry) => boolean
}

/** @inline */
export interface EditorNormalizeOptions {
  force?: boolean
  operation?: Operation
}

/** @inline */
export interface EditorParentOptions {
  depth?: number
  edge?: LeafEdge
}

/** @inline */
export interface EditorPathOptions {
  depth?: number
  edge?: LeafEdge
}

/** @inline */
export interface EditorPathRefOptions {
  affinity?: TextDirection | null
}

/** @inline */
export interface EditorPointOptions {
  edge?: LeafEdge
}

/** @inline */
export interface EditorPointRefOptions {
  affinity?: TextDirection | null
}

/** @inline */
export interface EditorPositionsOptions {
  /** The `Location` in which to iterate the positions of. */
  at?: Location

  /**
   * - `offset`: Moves to the next offset `Point`. It will include the `Point` at the end of a `Text` object and then move onto the first `Point` (at the 0th offset) of the next `Text` object. This may be counter-intuitive because the end of a `Text` and the beginning of the next `Text` might be thought of as the same position.
   * - `character`: Moves to the next `character` but is not always the next `index` in the string. This is because Unicode encodings may require multiple bytes to create one character. Unlike `offset`, `character` will not count the end of a `Text` and the beginning of the next `Text` as separate positions to return. Warning: The character offsets for Unicode characters does not appear to be reliable in some cases like a Smiley Emoji will be identified as 2 characters.
   * - `word`: Moves to the position immediately after the next `word`. In `reverse` mode, moves to the position immediately before the previous `word`.
   * - `line` | `block`: Starts at the beginning position and then the position at the end of the block. Then starts at the beginning of the next block and then the end of the next block.
   * @defaultValue 'offset'
   */
  unit?: TextUnitAdjustment

  /**
   * When `true` returns the positions in reverse order. In the case of the `unit` being `word`, the actual returned positions are different (i.e. we will get the start of a word in reverse instead of the end).
   * @defaultValue false
   */
  reverse?: boolean

  /**
   * When `true` include void Nodes.
   * @defaultValue false
   */
  voids?: boolean
}

/** @inline */
export interface EditorPreviousOptions<T extends Node> {
  at?: Location
  match?: NodeMatch<T>
  mode?: SelectionMode
  voids?: boolean
}

/** @inline */
export interface EditorRangeRefOptions {
  affinity?: RangeDirection | null
}

/** @inline */
export interface EditorStringOptions {
  voids?: boolean
}

/** @inline */
export interface EditorUnhangRangeOptions {
  /**
   * Allow placing the end of the selection in a void node.
   * @defaultValue false
   */
  voids?: boolean
}

/** @inline */
export interface EditorVoidOptions {
  at?: Location
  mode?: MaximizeMode
  voids?: boolean
}

export interface EditorInterface {
  /**
   * Get the ancestor above a location in the document.
   * @category Relational
   */
  above<T extends Ancestor>(
    editor: Editor,
    options?: EditorAboveOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Add a custom property to the leaf text nodes within non-void nodes or void
   * nodes that `editor.markableVoid()` allows in the current selection. If the
   * selection is currently collapsed, the marks will be added to the
   * `editor.marks` property instead, and applied when text is inserted next.
   * @category Commands
   */
  addMark(editor: Editor, key: string, value: any): void

  /**
   * Get the point after a location.
   * @category Relational
   */
  after(
    editor: Editor,
    at: Location,
    options?: EditorAfterOptions
  ): Point | undefined

  /**
   * Get the point before a location.
   * @category Relational
   */
  before(
    editor: Editor,
    at: Location,
    options?: EditorBeforeOptions
  ): Point | undefined

  /**
   * Delete content in the editor backward from the current selection.
   * @category Commands
   */
  deleteBackward(editor: Editor, options?: EditorDirectedDeletionOptions): void

  /**
   * Delete content in the editor forward from the current selection.
   * @category Commands
   */
  deleteForward(editor: Editor, options?: EditorDirectedDeletionOptions): void

  /**
   * Delete the content in the current selection.
   * @category Commands
   */
  deleteFragment(editor: Editor, options?: EditorFragmentDeletionOptions): void

  /**
   * Get the start and end points of a location.
   * @category Relational
   */
  edges(editor: Editor, at: Location): [Point, Point]

  /**
   * Match a read-only element in the current branch of the editor.
   * @category Relational
   */
  elementReadOnly(
    editor: Editor,
    options?: EditorElementReadOnlyOptions
  ): NodeEntry<Element> | undefined

  /**
   * Get the end point of a location.
   * @category Relational
   */
  end(editor: Editor, at: Location): Point

  /**
   * Get the first node at a location.
   * @category Relational
   */
  first(editor: Editor, at: Location): NodeEntry

  /**
   * Get the fragment at a location.
   * @category Queries
   */
  fragment(editor: Editor, at: Location): Descendant[]

  /**
   * Check if a node has block children.
   * @category Queries
   */
  hasBlocks(editor: Editor, element: Element): boolean

  /**
   * Check if a node has inline and text children.
   * @category Queries
   */
  hasInlines(editor: Editor, element: Element): boolean

  /**
   * Check if a descendant node exists at a specific path.
   * @category Queries
   */
  hasPath(editor: Editor, path: Path): boolean

  /**
   * Check if a node has text children.
   * @category Queries
   */
  hasTexts(editor: Editor, element: Element): boolean

  /**
   * Insert a block break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   * @category Commands
   */
  insertBreak(editor: Editor): void

  /**
   * Inserts a fragment
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   *
   * **WARNING**: Inserting a node that already exists in the document (or another active document) can cause problems with certain plugins like `slate-dom` and `slate-react` that expect each node to be a unique object.
   * @category Commands
   */
  insertFragment(
    editor: Editor,
    fragment: Node[],
    options?: TextInsertFragmentOptions
  ): void

  /**
   * Atomically inserts `nodes`
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   *
   * **WARNING**: Inserting a node that already exists in the document (or another active document) can cause problems with certain plugins like `slate-dom` and `slate-react` that expect each node to be a unique object.
   * @category Commands
   */
  insertNode<T extends Node>(
    editor: Editor,
    node: Node,
    options?: NodeInsertNodesOptions<T>
  ): void

  /**
   * Insert a soft break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   * @category Commands
   */
  insertSoftBreak(editor: Editor): void

  /**
   * Insert a string of text
   * at the specified location or (if not defined) the current selection or (if not defined) the end of the document.
   * @category Commands
   */
  insertText(
    editor: Editor,
    text: string,
    options?: TextInsertTextOptions
  ): void

  /**
   * Check if a value is a block `Element` object.
   * @category Queries
   */
  isBlock(editor: Editor, value: Element): boolean

  /**
   * Check if a point is an edge of a location.
   * @category Queries
   */
  isEdge(editor: Editor, point: Point, at: Location): boolean

  /**
   * Check if a value is an `Editor` object.
   * @category Queries
   */
  isEditor(value: any, options?: EditorIsEditorOptions): value is Editor

  /**
   * Check if a value is a read-only `Element` object.
   * @category Queries
   */
  isElementReadOnly(editor: Editor, element: Element): boolean

  /**
   * Check if an element is empty, accounting for void nodes.
   * @category Queries
   */
  isEmpty(editor: Editor, element: Element): boolean

  /**
   * Check if a point is the end point of a location.
   * @category Queries
   */
  isEnd(editor: Editor, point: Point, at: Location): boolean

  /**
   * Check if a value is an inline `Element` object.
   * @category Queries
   */
  isInline(editor: Editor, value: Element): boolean

  /**
   * Check if the editor is currently normalizing after each operation.
   * @category Queries
   */
  isNormalizing(editor: Editor): boolean

  /**
   * Check if a value is a selectable `Element` object.
   * @category Queries
   */
  isSelectable(editor: Editor, element: Element): boolean

  /**
   * Check if a point is the start point of a location.
   * @category Queries
   */
  isStart(editor: Editor, point: Point, at: Location): boolean

  /**
   * Check if a value is a void `Element` object.
   * @category Queries
   */
  isVoid(editor: Editor, value: Element): boolean

  /**
   * Get the last node at a location.
   * @category Relational
   */
  last(editor: Editor, at: Location): NodeEntry

  /**
   * Get the leaf text node at a location.
   * @category Retrieval
   */
  leaf(
    editor: Editor,
    at: Location,
    options?: EditorLeafOptions
  ): NodeEntry<Text>

  /**
   * Iterate through all of the levels at a location.
   * @category Relational
   */
  levels<T extends Node>(
    editor: Editor,
    options?: EditorLevelsOptions<T>
  ): Generator<NodeEntry<T>, void, undefined>

  /**
   * Get the marks that would be added to text at the current selection.
   * @category Queries
   */
  marks(editor: Editor): Omit<Text, 'text'> | null

  /**
   * Get the matching node in the branch of the document after a location.
   * @category Relational
   */
  next<T extends Descendant>(
    editor: Editor,
    options?: EditorNextOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Get the node at a location.
   */
  node(editor: Editor, at: Location, options?: EditorNodeOptions): NodeEntry

  /**
   * Iterate through all of the nodes in the Editor.
   * @category Relational
   */
  nodes<T extends Node>(
    editor: Editor,
    options?: EditorNodesOptions<T>
  ): Generator<NodeEntry<T>, void, undefined>

  /**
   * Normalize any dirty objects in the editor.
   * @category Commands
   */
  normalize(editor: Editor, options?: EditorNormalizeOptions): void

  /**
   * Get the parent node of a location.
   * @category Relational
   */
  parent(
    editor: Editor,
    at: Location,
    options?: EditorParentOptions
  ): NodeEntry<Ancestor>

  /**
   * Get the path of a location.
   * @category Queries
   */
  path(editor: Editor, at: Location, options?: EditorPathOptions): Path

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   * @category Create Ref
   */
  pathRef(editor: Editor, path: Path, options?: EditorPathRefOptions): PathRef

  /**
   * Get the set of currently tracked path refs of the editor.
   * @category Queries
   */
  pathRefs(editor: Editor): Set<PathRef>

  /**
   * Get the start or end point of a location.
   * @category Queries
   */
  point(editor: Editor, at: Location, options?: EditorPointOptions): Point

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the editor.
   * @category Create Ref
   */
  pointRef(
    editor: Editor,
    point: Point,
    options?: EditorPointRefOptions
  ): PointRef

  /**
   * Get the set of currently tracked point refs of the editor.
   * @category Queries
   */
  pointRefs(editor: Editor): Set<PointRef>

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
  positions(
    editor: Editor,
    options?: EditorPositionsOptions
  ): Generator<Point, void, undefined>

  /**
   * Get the matching node in the branch of the document before a location.
   * @category Relational
   */
  previous<T extends Node>(
    editor: Editor,
    options?: EditorPreviousOptions<T>
  ): NodeEntry<T> | undefined

  /**
   * Get a range of a location.
   * @category Queries
   */
  range(editor: Editor, at: Location, to?: Location): Range

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the editor.
   * @category Create Ref
   */
  rangeRef(
    editor: Editor,
    range: Range,
    options?: EditorRangeRefOptions
  ): RangeRef

  /**
   * Get the set of currently tracked range refs of the editor.
   * @category Queries
   */
  rangeRefs(editor: Editor): Set<RangeRef>

  /**
   * Remove a custom property from all of the leaf text nodes in the current
   * selection.
   *
   * If the selection is currently collapsed, the removal will be stored on
   * `editor.marks` and applied to the text inserted next.
   * @category Commands
   */
  removeMark(editor: Editor, key: string): void

  /**
   * Manually set if the editor should currently be normalizing.
   *
   * Note: Using this incorrectly can leave the editor in an invalid state.
   *
   */
  setNormalizing(editor: Editor, isNormalizing: boolean): void

  /**
   * Get the start point of a location.
   * @category Relational
   */
  start(editor: Editor, at: Location): Point

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option
   * @category Queries
   */
  string(editor: Editor, at: Location, options?: EditorStringOptions): string

  /**
   * Convert a range into a non-hanging one.
   *
   * A "hanging" range is one created by the browser's "triple-click" selection behavior. When triple-clicking a block, the browser selects from the start of that block to the start of the _next_ block. The range thus "hangs over" into the next block. If `unhangRange` is given such a range, it moves the end backwards until it's in a non-empty text node that precedes the hanging block.
   *
   * Note that `unhangRange` is designed for the specific purpose of fixing triple-clicked blocks, and therefore currently has a number of caveats:
   *
   * - It does not modify the start of the range; only the end. For example, it does not "unhang" a selection that starts at the end of a previous block.
   * - It only does anything if the start block is fully selected. For example, it does not handle ranges created by double-clicking the end of a paragraph (which browsers treat by selecting from the end of that paragraph to the start of the next).
   * @category Selection Commands
   */
  unhangRange(
    editor: Editor,
    range: Range,
    options?: EditorUnhangRangeOptions
  ): Range

  /**
   * Match a void node in the current branch of the editor.
   * @category Relational
   */
  void(
    editor: Editor,
    options?: EditorVoidOptions
  ): NodeEntry<Element> | undefined

  /**
   * Call a function, deferring normalization until after it completes.
   */
  withoutNormalizing(editor: Editor, fn: () => void): void

  /**
   *  Call a function, Determine whether or not remove the previous node when merge.
   * @category Queries
   */
  shouldMergeNodesRemovePrevNode(
    editor: Editor,
    prevNodeEntry: NodeEntry,
    curNodeEntry: NodeEntry
  ): boolean
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

  isEditor,

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

  shouldMergeNodesRemovePrevNode(editor, prevNode, curNode) {
    return editor.shouldMergeNodesRemovePrevNode(prevNode, curNode)
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
