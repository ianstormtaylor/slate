# Editor API

The `Editor` object stores all the state of a Slate editor. It can be extended by [plugins](../../concepts/08-plugins.md) to add helpers and implement new behaviors. It's a type of `Node` and its path is `[]`.

```typescript
interface Editor {
  children: Node[]
  selection: Range | null
  operations: Operation[]
  marks: Omit<Text, 'text'> | null

  // Schema-specific node behaviors.
  isInline: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  normalizeNode: (entry: NodeEntry) => void
  onChange: (options?: { operation?: Operation }) => void

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

- [Instantiation methods](editor.md#instantiation-methods)
- [Static methods](editor.md#static-methods)
  - [Retrieval methods](editor.md#retrieval-methods)
  - [Manipulation methods](editor.md#manipulation-methods)
  - [Check methods](editor.md#check-methods)
  - [Normalization methods](editor.md#normalization-methods)
  - [Ref methods](editor.md#ref-methods)
- [Instance methods](editor.md#instance-methods)
  - [Schema-specific methods to override](editor.md#schema-specific-instance-methods-to-override)
  - [Element Type Methods](editor.md/#element-type-methods)
  - [Normalize Methods](editor.md/#normalize-methods)
  - [Callback Method](editor.md/#callback-method)
  - [Mark Methods](editor.md/#mark-methods)
  - [getFragment Method](editor.md/#getfragment-method)
  - [Delete Methods](editor.md/#delete-methods)
  - [Insert Methods](editor.md/#insert-methods)
  - [Operation Handling Method](editor.md/#operation-handling-method)

## Instantiation methods

#### `createEditor() => Editor`

Note: This method is imported directly from Slate and is not part of the Editor object.

Creates a new, empty `Editor` object.

## Static methods

### Retrieval methods

#### `Editor.above<T extends Ancestor>(editor: Editor, options?) => NodeEntry<T> | undefined`

Get the matching ancestor above a location in the document.

Options:

- `at?: Location = editor.selection`: Where to start at which is `editor.selection` by default.
- `match?: NodeMatch = () => true`: Narrow the match
- `mode?: 'highest' | 'lowest' = 'lowest'`: If `lowest` (default), returns the lowest matching ancestor. If `highest`, returns the highest matching ancestor.
- `voids?: boolean = false`: When `false` ignore void objects.

#### `Editor.after(editor: Editor, at: Location, options?) => Point | undefined`

Get the point after a location.

If there is no point after the location (e.g. we are at the bottom of the document) returns `undefined`.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

#### `Editor.before(editor: Editor, at: Location, options?) => Point | undefined`

Get the point before a location.

If there is no point before the location (e.g. we are at the top of the document) returns `undefined`.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

#### `Editor.edges(editor: Editor, at: Location) => [Point | undefined, Point | undefined]`

Get the start and end points of a location.

#### `Editor.end(editor: Editor, at: Location) => Point | undefined`

Get the end point of a location.

#### `Editor.first(editor: Editor, at: Location) => NodeEntry | undefined`

Get the first node at a location.

#### `Editor.fragment(editor: Editor, at: Location) => Descendant[]`

Get the fragment at a location.

#### `Editor.last(editor: Editor, at: Location) => NodeEntry | undefined`

Get the last node at a location.

#### `Editor.leaf(editor: Editor, at: Location, options?) => NodeEntry | undefined`

Get the leaf text node at a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.levels<T extends Node>(editor: Editor, options?) => Generator<NodeEntry<T>, void, undefined>`

Iterate through all of the levels at a location.

Options: `{at?: Location, match?: NodeMatch, reverse?: boolean, voids?: boolean}`

#### `Editor.marks(editor: Editor) => Omit<Text, 'text'> | null`

Get the marks that would be added to text at the current selection.

#### `Editor.next<T extends Descendant>(editor: Editor, options?) => NodeEntry<T> | undefined`

Get the matching node in the branch of the document after a location.

Note: To find the next Point, and not the next Node, use the `Editor.after` method

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

#### `Editor.node(editor: Editor, at: Location, options?) => NodeEntry | undefined`

Get the node at a location.

Options: `depth?: number, edge?: 'start' | 'end'`

#### `Editor.nodes<T extends Node>(editor: Editor, options?) => Generator<NodeEntry<T>, void, undefined>`

At any given `Location` or `Span` in the editor provided by `at` (default is the current selection), the method returns a Generator of `NodeEntry` objects that represent the nodes that include `at`. At the top of the hierarchy is the `Editor` object itself.

Options: `{at?: Location | Span, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', universal?: boolean, reverse?: boolean, voids?: boolean}`

`options.match`: Provide a value to the `match?` option to limit the `NodeEntry` objects that are returned.

`options.mode`:

- `'all'` (default): Return all matching nodes
- `'highest'`: in a hierarchy of nodes, only return the highest level matching nodes
- `'lowest'`: in a hierarchy of nodes, only return the lowest level matching nodes

#### `Editor.parent(editor: Editor, at: Location, options?) => NodeEntry<Ancestor> | undefined`

Get the parent node of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.path(editor: Editor, at: Location, options?) => Path | undefined`

Get the path of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.point(editor: Editor, at: Location, options?) => Point | undefined`

Get the start or end point of a location.

Options: `{edge?: 'start' | 'end'}`

#### `Editor.positions(editor: Editor, options?) => Generator<Point, void, undefined>`

Iterate through all of the positions in the document where a `Point` can be placed. The first `Point` returns is always the starting point followed by the next `Point` as determined by the `unit` option.

Read `options.unit` to see how this method iterates through positions.

Note: By default void nodes are treated as a single point and iteration will not happen inside their content unless the voids option is set, then iteration will occur.

Options:

- `at?: Location = editor.selection`: The `Location` in which to iterate the positions of.
- `unit?: 'offset' | 'character' | 'word' | 'line' | 'block' = 'offset'`:
  - `offset`: Moves to the next offset `Point`. It will include the `Point` at the end of a `Text` object and then move onto the first `Point` (at the 0th offset) of the next `Text` object. This may be counter-intuitive because the end of a `Text` and the beginning of the next `Text` might be thought of as the same position.
  - `character`: Moves to the next `character` but is not always the next `index` in the string. This is because Unicode encodings may require multiple bytes to create one character. Unlike `offset`, `character` will not count the end of a `Text` and the beginning of the next `Text` as separate positions to return. Warning: The character offsets for Unicode characters does not appear to be reliable in some cases like a Smiley Emoji will be identified as 2 characters.
  - `word`: Moves to the position immediately after the next `word`. In `reverse` mode, moves to the position immediately before the previous `word`.
  - `line` | `block`: Starts at the beginning position and then the position at the end of the block. Then starts at the beginning of the next block and then the end of the next block.
- `reverse?: boolean = false`: When `true` returns the positions in reverse order. In the case of the `unit` being `word`, the actual returned positions are different (i.e. we will get the start of a word in reverse instead of the end).
- `voids?: boolean = false`: When `true` include void Nodes.

#### `Editor.previous<T extends Node>(editor: Editor, options?) => NodeEntry<T> | undefined`

Get the matching node in the branch of the document before a location.

Note: To find the previous Point, and not the previous Node, use the `Editor.before` method

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

#### `Editor.range(editor: Editor, at: Location, to?: Location) => Range | undefined`

Get a range of a location.

#### `Editor.start(editor: Editor, at: Location) => Point | undefined`

Get the start point of a location.

#### `Editor.string(editor: Editor, at: Location, options?) => string`

Get the text string content of a location.

Note: by default the text of void nodes is considered to be an empty string, regardless of content, unless the voids option is set.

Options: : `{voids?: boolean}`

#### `Editor.void(editor: Editor, options?) => NodeEntry<Element> | undefined`

Match a void node in the current branch of the editor.

Options: `{at?: Location, mode?: 'highest' | 'lowest', voids?: boolean}`

### Manipulation methods

#### `Editor.addMark(editor: Editor, key: string, value: any) => void`

Add a custom property to the leaf text nodes and any nodes that `editor.markableVoid()` allows in the current selection.

If the selection is currently collapsed, the marks will be added to the `editor.marks` property instead, and applied when text is inserted next.

#### `Editor.deleteBackward(editor: Editor, options?) => void`

Delete content in the editor backward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

#### `Editor.deleteForward(editor: Editor, options?) => void`

Delete content in the editor forward from the current selection.

Options: `{unit?: 'character' | 'word' | 'line' | 'block'}`

#### `Editor.deleteFragment(editor: Editor) => void`

Delete the content in the current selection.

#### `Editor.insertBreak(editor: Editor) => void`

Insert a block break at the current selection.

#### `Editor.insertFragment(editor: Editor, fragment: Node[], options?) => void`

Inserts a fragment at the specified location or (if not defined) the current selection or (if not defined) the end of the document.

Options: `{at?: Location, hanging?: boolean, voids?: boolean}`

#### `Editor.insertNode(editor: Editor, node: Node, options?) => void`

Atomically insert `node` at the specified location or (if not defined) the current selection or (if not defined) the end of the document.

Options supported: `NodeOptions & {hanging?: boolean, select?: boolean}`.

#### `Editor.insertText(editor: Editor, text: string, options?) => void`

Insert a string of text at the specified location or (if not defined) the current selection or (if not defined) the end of the document.

Options: `{at?: Location, voids?: boolean}`

#### `Editor.removeMark(editor: Editor, key: string) => void`

Remove a custom property from all of the leaf text nodes within non-void nodes or void nodes that `editor.markableVoid()` allows in the current selection.

If the selection is currently collapsed, the removal will be stored on `editor.marks` and applied to the text inserted next.

#### `Editor.unhangRange(editor: Editor, range: Range, options?) => Range`

Convert a range into a non-hanging one.

A "hanging" range is one created by the browser's "triple-click" selection behavior. When triple-clicking a block, the browser selects from the start of that block to the start of the _next_ block. The range thus "hangs over" into the next block. If `unhangRange` is given such a range, it moves the end backwards until it's in a non-empty text node that precedes the hanging block.

Note that `unhangRange` is designed for the specific purpose of fixing triple-clicked blocks, and therefore currently has a number of caveats:

- It does not modify the start of the range; only the end. For example, it does not "unhang" a selection that starts at the end of a previous block.
- It only does anything if the start block is fully selected. For example, it does not handle ranges created by double-clicking the end of a paragraph (which browsers treat by selecting from the end of that paragraph to the start of the next).

Options:

- `voids?: boolean = false`: Allow placing the end of the selection in a void node.

### Check methods

#### `Editor.hasBlocks(editor: Editor, element: Element) => boolean`

Check if a node has block children.

#### `Editor.hasInlines(editor: Editor, element: Element) => boolean`

Check if a node has inline and text children.

#### `Editor.hasTexts(editor: Editor, element: Element) => boolean`

Check if a node has text children.

#### `Editor.isBlock(editor: Editor, value: any) => value is Element`

Check if a value is a block `Element` object.

#### `Editor.isEditor(value: any) => value is Editor`

Check if a value is an `Editor` object.

#### `Editor.isEnd(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is the end point of a location.

#### `Editor.isEdge(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is an edge of a location.

#### `Editor.isEmpty(editor: Editor, element: Element) => boolean`

Check if an element is empty, accounting for void nodes.

#### `Editor.isInline(editor: Editor, value: any) => value is Element`

Check if a value is an inline `Element` object.

#### `Editor.isNormalizing(editor: Editor) => boolean`

Check if the editor is currently normalizing after each operation.

#### `Editor.isStart(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is the start point of a location.

#### `Editor.isVoid(editor: Editor, value: any) => value is Element`

Check if a value is a void `Element` object.

### Normalization methods

#### `Editor.normalize(editor: Editor, options?) => void`

Normalize any dirty objects in the editor.

Options: `{force?: boolean; operation?: Operation}`

#### `Editor.withoutNormalizing(editor: Editor, fn: () => void) => void`

Call a function, deferring normalization until after it completes.
See [Normalization - Implications for Other Code](./11-normalizing.md#implications-for-other-code);

### Ref Methods

#### `Editor.pathRef(editor: Editor, path: Path, options?) => PathRef`

Create a mutable ref for a `Path` object, which will stay in sync as new operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

#### `Editor.pathRefs(editor: Editor) => Set<PathRef>`

Get the set of currently tracked path refs of the editor.

#### `Editor.pointRef(editor: Editor, point: Point, options?) => PointRef`

Create a mutable ref for a `Point` object, which will stay in sync as new operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | null}`

#### `Editor.pointRefs(editor: Editor) => Set<PointRef>`

Get the set of currently tracked point refs of the editor.

#### `Editor.rangeRef(editor: Editor, range: Range, options?) => RangeRef`

Create a mutable ref for a `Range` object, which will stay in sync as new operations are applied to the editor.

Options: `{affinity?: 'backward' | 'forward' | 'outward' | 'inward' | null}`

#### `Editor.rangeRefs(editor: Editor) => Set<RangeRef>`

Get the set of currently tracked range refs of the editor.

## Instance Methods

### Schema-specific instance methods to override

Replace these methods to modify the original behavior of the editor when building [Plugins](../../concepts/08-plugins.md). When modifying behavior, call the original method when appropriate. For example, a plugin that marks image nodes as "void":

```javascript
const withImages = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  return editor
}
```

### Element type methods

Use these methods so that Slate can identify certain elements as [inlines](../../concepts/02-nodes.md#blocks-vs-inlines) or [voids](../../concepts/02-nodes.md#voids).

#### `isInline(element: Element) => boolean`

Check if a value is an inline `Element` object.

#### `isVoid(element: Element) => boolean`

Check if a value is a void `Element` object.

### Normalize methods

#### `normalizeNode(entry: NodeEntry, { operation }) => void`

[Normalize](../../concepts/11-normalizing.md) a Node according to the schema.

#### `shouldNormalize: (options) => boolean`

Override this method to prevent normalizing the editor.

Options: `{ dirtyPaths: Path[]; initialDirtyPathsLength: number; iteration: number; operation?: Operation }`

### Callback method

#### `onChange(options?: { operation?: Operation }) => void`

Called when there is a change in the editor.

### Mark methods

#### `markableVoid: (element: Element) => boolean`

Tells which void nodes accept Marks. Slate's default implementation returns `false`, but if some void elements support formatting, override this function to include them.

#### `addMark(key: string, value: any) => void`

Add a custom property to the leaf text nodes within non-void nodes or void nodes that `editor.markableVoid()` allows in the current selection. If the selection is currently collapsed, the marks will be added to the `editor.marks` property instead, and applied when text is inserted next.

#### `removeMark(key: string) => void`

Remove a custom property from the leaf text nodes within non-void nodes or void nodes that `editor.markableVoid()` allows in the current selection.

### getFragment method

#### `getFragment() => Descendant`

Returns the fragment at the current selection. Used when cutting or copying, as an example, to get the fragment at the current selection.

### Delete methods

When a user presses backspace or delete, it invokes the method based on the selection. For example, if the selection is expanded over some text and the user presses the backspace key, `deleteFragment` will be called, but if the selection is collapsed, `deleteBackward` will be called.

#### `deleteBackward(options?: {unit?: 'character' | 'word' | 'line' | 'block'}) => void`

Delete content in the editor backward from the current selection.

#### `deleteForward(options?: {unit?: 'character' | 'word' | 'line' | 'block'}) => void`

Delete content in the editor forward from the current selection.

#### `deleteFragment() => void`

Delete the content of the current selection.

### Insert methods

#### `insertFragment(fragment: Node[]) => void`

Insert a fragment at the current selection. If the selection is currently expanded, delete it first.

#### `insertBreak() => void`

Insert a block break at the current selection. If the selection is currently expanded, delete it first.

#### `insertSoftBreak() => void`

Insert a soft break at the current selection. If the selection is currently expanded, delete it first.

#### `insertNode(node: Node) => void`

Insert a node at the current selection. If the selection is currently expanded, delete it first.

#### `insertText(text: string) => void`

Insert text at the current selection. If the selection is currently expanded, delete it first.

### Operation handling method

#### `apply(operation: Operation) => void`

Apply an operation in the editor.
