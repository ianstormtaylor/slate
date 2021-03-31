# Editor

The `Editor` object stores all the state of a slate editor. It can be extended by plugins to add helpers and implement new behaviors.

```typescript
interface Editor {
  children: Node[]
  selection: Range | null
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
  deleteFragment: () => void
  insertBreak: () => void
  insertFragment: (fragment: Node[]) => void
  insertNode: (node: Node) => void
  insertText: (text: string) => void
  removeMark: (key: string) => void
}
```

- [Instantiation methods](#instantiation-methods)
- [Static methods](#static-methods)
  - [Retrieval methods](#retrieval-methods)
  - [Manipulation methods](#manipulation-methods)
  - [Check methods](#check-methods)
  - [Normalization methods](#normalization-methods)
- [Instance methods](#instance-methods)
  - [Schema-specific methods to override](#schema-specific-methods-to-override)
  - [Core actions](#core-actions)

## Instantiation methods

###### `createEditor(): Editor`

Note: This method is imported directly from Slate and is not part of the Editor object.

Creates a new, empty `Editor` object.

## Static methods

### Retrieval methods

###### `Editor.above<T extends Ancestor>(editor: Editor, options?): NodeEntry | undefined`

Get the ancestor above a location in the document.

Options: `{at?: Location, match?: NodeMatch, mode?: 'highest' | 'lowest', voids?: boolean}`

###### `Editor.after(editor: Editor, at: Location, options?): Point | undefined`

Get the point after a location.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

###### `Editor.before(editor: Editor, at: Location, options?): Point | undefined`

Get the point before a location.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

###### `Editor.edges(editor: Editor, at: Location): [Point, Point]`

Get the start and end points of a location.

###### `Editor.end(editor: Editor, at: Location): Point`

Get the end point of a location.

###### `Editor.first(editor: Editor, at: Location): NodeEntry`

Get the first node at a location.

###### `Editor.fragment(editor: Editor, at: Location): Descendant[]`

Get the fragment at a location.

###### `Editor.last(editor: Editor, at: Location): NodeEntry`

Get the last node at a location.

###### `Editor.leaf(editor: Editor, at: Location, options?): NodeEntry`

Get the leaf text node at a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `Editor.levels<T extends Node>(editor: Editor, options?): Generator<NodeEntry, void, undefined>`

Iterate through all of the levels at a location.

Options: `{at?: Location, match?: NodeMatch, reverse?: boolean, voids?: boolean}`

###### `Editor.next<T extends Descendant>(editor: Editor, options?): NodeEntry<T> | undefined`

Get the matching node in the branch of the document after a location.

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

###### `Editor.node(editor: Editor, at: Location, options?): NodeEntry`

Get the node at a location.

Options: `depth?: number, edge?: 'start' | 'end'`

###### `Editor.nodes(editor: Editor, options?): Generator<NodeEntry<T>, void, undefined>`

Iterate through all of the nodes in the Editor.

Options: `{at?: Location | Span, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', universal?: boolean, reverse?: boolean, voids?: boolean}`

###### `Editor.parent(editor: Editor, at: Location, options?): NodeEntry<Ancestor>`

Get the parent node of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `Editor.path(editor: Editor, at: Location, options?): Path`

Get the path of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `Editor.pathRef(editor: Editor, path: Path, options?): PathRef`

Create a mutable ref for a `Path` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

###### `Editor.pathRefs(editor: Editor): Set<PathRef>`

Get the set of currently tracked path refs of the editor.

###### `Editor.point(editor: Editor, at: Location, options?): Point`

Get the start or end point of a location.

Options: `{edge?: 'start' | 'end'}`

###### `Editor.pointRef(editor: Editor, point: Point, options?): PointRef`

Create a mutable ref for a `Point` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

###### `Editor.pointRefs(editor: Editor): Set<PointRef>`

Get the set of currently tracked point refs of the editor.

###### `Editor.positions(editor: Editor, options?): Generator<Point, void, undefined>`

Iterate through all of the positions in the document where a `Point` can be
placed.

By default it will move forward by individual offsets at a time, but you
can pass the `unit: 'character'` option to moved forward one character, word,
or line at at time.

Note: By default void nodes are treated as a single point and iteration
will not happen inside their content unless you pass in true for the
voids option, then iteration will occur.

Options: `{at?: Location, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', reverse?: boolean, voids?: boolean}`

###### `Editor.previous(editor: Editor, options?): NodeEntry<T> | undefined`

Get the matching node in the branch of the document before a location.

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

###### `Editor.range(editor: Editor, at: Location, to?: Location): Range`

Get a range of a location.

###### `Editor.rangeRef(editor: Editor, range: Range, options?): RangeRef`

Create a mutable ref for a `Range` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null}`

###### `Editor.rangeRefs(editor: Editor): Set<RangeRef>`

Get the set of currently tracked range refs of the editor.

###### `Editor.start(editor: Editor, at: Location): Point`

Get the start point of a location.

###### `Editor.string(editor: Editor, at: Location, options?): string`

Get the text string content of a location.

Note: by default the text of void nodes is considered to be an empty
string, regardless of content, unless you pass in true for the voids option

Options: : `{voids?: boolean}`

###### `Editor.void(editor: Editor, options?): NodeEntry<Element> | undefined`

Match a void node in the current branch of the editor.

Options: `{at?: Location, mode?: 'highest' | 'lowest', voids?: boolean}`

### Manipulation methods

###### `Editor.addMark(editor: Editor, key: string, value: any): void`

Add a custom property to the leaf text nodes in the current selection.

If the selection is currently collapsed, the marks will be added to the
`editor.marks` property instead, and applied when text is inserted next.

###### `Editor.deleteBackward(editor: Editor, options?): void`

Delete content in the editor backward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

###### `Editor.deleteForward(editor: Editor, options?): void`

Delete content in the editor forward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

###### `Editor.deleteFragment(editor: Editor): void`

Delete the content in the current selection.

###### `Editor.insertBreak(editor: Editor): void`

Insert a block break at the current selection.

###### `Editor.insertFragment(editor: Editor, fragment: Node[]): void`

Insert a fragment at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `Editor.insertNode(editor: Editor, node: Node): void`

Insert a node at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `Editor.insertText(editor: Editor, text: string): void`

Insert text at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `Editor.removeMark(editor: Editor, key: string): void`

Remove a custom property from all of the leaf text nodes in the current
selection.

If the selection is currently collapsed, the removal will be stored on
`editor.marks` and applied to the text inserted next.

###### `Editor.unhangRange(editor: Editor, range: Range, options?): Range`

Convert a range into a non-hanging one.

Options: `{voids?: boolean}`

### Check methods

###### `Editor.hasBlocks(editor: Editor, element: Element): boolean`

Check if a node has block children.

###### `Editor.hasInlines(editor: Editor, element: Element): boolean`

Check if a node has inline and text children.

###### `Editor.hasTexts(editor: Editor, element: Element): boolean`

Check if a node has text children.

###### `Editor.isBlock(editor: Editor, value: any): value is Element`

Check if a value is a block `Element` object.

###### `Editor.isEditor(value: any): value is Editor`

Check if a value is an `Editor` object.

###### `Editor.isEnd(editor: Editor, point: Point, at: Location): boolean`

Check if a point is the end point of a location.

###### `Editor.isEdge(editor: Editor, point: Point, at: Location): boolean`

Check if a point is an edge of a location.

###### `Editor.isEmpty(editor: Editor, element: Element): boolean`

Check if an element is empty, accounting for void nodes.

###### `Editor.isInline(editor: Editor, value: any): value is Element`

Check if a value is an inline `Element` object.

###### `Editor.isNormalizing(editor: Editor): boolean`

Check if the editor is currently normalizing after each operation.

###### `Editor.isStart(editor: Editor, point: Point, at: Location): boolean`

Check if a point is the start point of a location.

###### `Editor.isVoid(editor: Editor, value: any): value is Element`

Check if a value is a void `Element` object.

### Normalization methods

###### `Editor.normalize(editor: Editor, options?): void`

Normalize any dirty objects in the editor.

Options: `{force?: boolean}`

###### `Editor.withoutNormalizing(editor: Editor, fn: () => void): void`

Call a function, deferring normalization until after it completes.

## Instance methods

### Schema-specific methods to override

Replace these methods to modify the original behavior of the editor when building [Plugins](/concepts/07-plugins). When modifying behavior, call the original method when appropriate. For example, a plugin that marks image nodes as "void":

```js
const withImages = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  return editor
}
```

###### `isInline(element: Element)`

Check if a value is an inline `Element` object.

###### `isVoid(element: Element)`

Check if a value is a void `Element` object.

###### `normalizeNode(entry: NodeEntry)`

Normalize a Node according to the schema.

###### `onChange()`

Called when there is a change in the editor.

### Core actions

###### `addMark(key: string, value: any)`

Add a custom property to the leaf text nodes in the current selection. If the selection is currently collapsed, the marks will be added to the `editor.marks` property instead, and applied when text is inserted next.

###### `removeMark(key: string)`

Remove a custom property from the leaf text nodes in the current selection.

###### `deleteBackward(options?: {unit?: 'character' | 'word' | 'line' | 'block'})`

Delete content in the editor backward from the current selection.

###### `deleteForward(options?: {unit?: 'character' | 'word' | 'line' | 'block'})`

Delete content in the editor forward from the current selection.

###### `insertFragment(fragment: Node[])`

Insert a fragment at the current selection. If the selection is currently expanded, delete it first.

###### `deleteFragment()`

Delete the content of the current selection.

###### `insertBreak()`

Insert a block break at the current selection. If the selection is currently expanded, delete it first.

###### `insertNode(node: Node)`

Insert a node at the current selection. If the selection is currently expanded, delete it first.

###### `insertText(text: string)`

Insert text at the current selection. If the selection is currently expanded, delete it first.

###### `apply(operation: Operation)`

Apply an operation in the editor.
