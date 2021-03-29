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

## Static methods

###### `above<T extends Ancestor>(editor: Editor, options?): NodeEntry | undefined`

Get the ancestor above a location in the document.

Options: `{at?: Location, match?: NodeMatch, mode?: 'highest' | 'lowest', voids?: boolean}`

###### `addMark(editor: Editor, key: string, value: any): void`

Add a custom property to the leaf text nodes in the current selection.

If the selection is currently collapsed, the marks will be added to the
`editor.marks` property instead, and applied when text is inserted next.

###### `after(editor: Editor, at: Location, options?): Point | undefined`

Get the point after a location.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

###### `before(editor: Editor, at: Location, options?): Point | undefined`

Get the point before a location.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

###### `deleteBackward(editor: Editor, options?): void`

Delete content in the editor backward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

###### `deleteForward(editor: Editor, options?): void`

Delete content in the editor forward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

###### `deleteFragment(editor: Editor): void`

Delete the content in the current selection.

###### `edges(editor: Editor, at: Location): [Point, Point]`

Get the start and end points of a location.

###### `end(editor: Editor, at: Location): Point`

Get the end point of a location.

###### `first(editor: Editor, at: Location): NodeEntry`

Get the first node at a location.

###### `fragment(editor: Editor, at: Location): Descendant[]`

Get the fragment at a location.

###### `hasBlocks(editor: Editor, element: Element): boolean`

Check if a node has block children.

###### `hasInlines(editor: Editor, element: Element): boolean`

Check if a node has inline and text children.

###### `hasTexts(editor: Editor, element: Element): boolean`

Check if a node has text children.

###### `insertBreak(editor: Editor): void`

Insert a block break at the current selection.

###### `insertFragment(editor: Editor, fragment: Node[]): void`

Insert a fragment at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `insertNode(editor: Editor, node: Node): void`

Insert a node at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `insertText(editor: Editor, text: string): void`

Insert text at the current selection.

If the selection is currently expanded, it will be deleted first.

###### `isBlock(editor: Editor, value: any): value is Element`

Check if a value is a block `Element` object.

###### `isEditor(value: any): value is Editor`

Check if a value is an `Editor` object.

###### `isEnd(editor: Editor, point: Point, at: Location): boolean`

Check if a point is the end point of a location.

###### `isEdge(editor: Editor, point: Point, at: Location): boolean`

Check if a point is an edge of a location.

###### `isEmpty(editor: Editor, element: Element): boolean`

Check if an element is empty, accounting for void nodes.

###### `isInline(editor: Editor, value: any): value is Element`

Check if a value is an inline `Element` object.

###### `isNormalizing(editor: Editor): boolean`

Check if the editor is currently normalizing after each operation.

###### `isStart(editor: Editor, point: Point, at: Location): boolean`

Check if a point is the start point of a location.

###### `isVoid(editor: Editor, value: any): value is Element`

Check if a value is a void `Element` object.

###### `last(editor: Editor, at: Location): NodeEntry`

Get the last node at a location.

###### `leaf(editor: Editor, at: Location, options?): NodeEntry`

Get the leaf text node at a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `levels<T extends Node>(editor: Editor, options?): Generator<NodeEntry, void, undefined>`

Iterate through all of the levels at a location.

Options: `{at?: Location, match?: NodeMatch, reverse?: boolean, voids?: boolean}`

###### `next<T extends Descendant>(editor: Editor, options?): NodeEntry<T> | undefined`

Get the matching node in the branch of the document after a location.

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

###### `node(editor: Editor, at: Location, options?): NodeEntry`

Get the node at a location.

Options: `depth?: number, edge?: 'start' | 'end'`

###### `nodes(editor: Editor, options?): Generator<NodeEntry<T>, void, undefined>`

Iterate through all of the nodes in the Editor.

Options: `{at?: Location | Span, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', universal?: boolean, reverse?: boolean, voids?: boolean}`

###### `normalize(editor: Editor, options?): void`

Normalize any dirty objects in the editor.

Options: `{force?: boolean}`

###### `parent(editor: Editor, at: Location, options?): NodeEntry<Ancestor>`

Get the parent node of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `path(editor: Editor, at: Location, options?): Path`

Get the path of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

###### `pathRef(editor: Editor, path: Path, options?): PathRef`

Create a mutable ref for a `Path` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

###### `pathRefs(editor: Editor): Set<PathRef>`

Get the set of currently tracked path refs of the editor.

###### `point(editor: Editor, at: Location, options?): Point`

Get the start or end point of a location.

Options: `{edge?: 'start' | 'end'}`

###### `pointRef(editor: Editor, point: Point, options?): PointRef`

Create a mutable ref for a `Point` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

###### `pointRefs(editor: Editor): Set<PointRef>`

Get the set of currently tracked point refs of the editor.

###### `positions(editor: Editor, options?): Generator<Point, void, undefined>`

Iterate through all of the positions in the document where a `Point` can be
placed.

By default it will move forward by individual offsets at a time, but you
can pass the `unit: 'character'` option to moved forward one character, word,
or line at at time.

Note: By default void nodes are treated as a single point and iteration
will not happen inside their content unless you pass in true for the
voids option, then iteration will occur.

Options: `{at?: Location, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', reverse?: boolean, voids?: boolean}`

###### `previous(editor: Editor, options?): NodeEntry<T> | undefined`

Get the matching node in the branch of the document before a location.

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

###### `range(editor: Editor, at: Location, to?: Location): Range`

Get a range of a location.

###### `rangeRef(editor: Editor, range: Range, options?): RangeRef`

Create a mutable ref for a `Range` object, which will stay in sync as new
operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null}`

###### `rangeRefs(editor: Editor): Set<RangeRef>`

Get the set of currently tracked range refs of the editor.

###### `removeMark(editor: Editor, key: string): void`

Remove a custom property from all of the leaf text nodes in the current
selection.

If the selection is currently collapsed, the removal will be stored on
`editor.marks` and applied to the text inserted next.

###### `start(editor: Editor, at: Location): Point`

Get the start point of a location.

###### `string(editor: Editor, at: Location, options?): string`

Get the text string content of a location.

Note: by default the text of void nodes is considered to be an empty
string, regardless of content, unless you pass in true for the voids option

Options: : `{voids?: boolean}`

###### `unhangRange(editor: Editor, range: Range, options?): Range`

Convert a range into a non-hanging one.

Options: `{voids?: boolean}`

###### `void(editor: Editor, options?): NodeEntry<Element> | undefined`

Match a void node in the current branch of the editor.

Options: `{at?: Location, mode?: 'highest' | 'lowest', voids?: boolean}`

###### `withoutNormalizing(editor: Editor, fn: () => void): void`

Call a function, deferring normalization until after it completes.

### Instance methods

### Schema-specific methods to override

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
