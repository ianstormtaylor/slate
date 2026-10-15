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
  isIsolated: (element: Element) => boolean
  isVoid: (element: Element) => boolean
  markableVoid: (element: Element) => boolean
  inlineEdgeAffinity: (
    element: Element,
    edge: 'start' | 'end'
  ) => 'inside' | 'outside' | null
  leafEdgeAffinity: (before: Text, after: Text) => 'backward' | 'forward' | null
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

For `unit: 'word'`, `isWordCharacter?: (character: string) => boolean` customizes word boundaries. The callback receives a whole grapheme, including a combined character or emoji. For example, `isWordCharacter: character => /[\w-]/.test(character)` treats `foo-bar_baz` as one word. A custom callback replaces the default punctuation rules and language segmentation; it is ignored for other units.

#### `Editor.before(editor: Editor, at: Location, options?) => Point | undefined`

Get the point before a location.

If there is no point before the location (e.g. we are at the top of the document) returns `undefined`.

Options: `{distance?: number, unit?: 'offset' | 'character' | 'word' | 'line' | 'block', voids?: boolean}`

For `unit: 'word'`, `isWordCharacter?: (character: string) => boolean` customizes word boundaries. The callback receives a whole grapheme, including a combined character or emoji. For example, `isWordCharacter: character => /[\w-]/.test(character)` treats `foo-bar_baz` as one word. A custom callback replaces the default punctuation rules and language segmentation; it is ignored for other units.

#### `Editor.edges(editor: Editor, at: Location) => [Point, Point]`

Get the start and end points of a location.

#### `Editor.end(editor: Editor, at: Location) => Point`

Get the end point of a location.

#### `Editor.first(editor: Editor, at: Location) => NodeEntry`

Get the first node at a location.

#### `Editor.fragment(editor: Editor, at: Location) => Descendant[]`

Get the fragment at a location.

#### `Editor.last(editor: Editor, at: Location) => NodeEntry`

Get the last node at a location.

#### `Editor.leaf(editor: Editor, at: Location, options?) => NodeEntry`

Get the leaf text node at a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.levels<T extends Node>(editor: Editor, options?) => Generator<NodeEntry<T>, void, undefined>`

Iterate through all of the levels at a location.

Options: `{at?: Location, match?: NodeMatch, reverse?: boolean, voids?: boolean}`

#### `Editor.insertionPoint(editor: Editor, point: Point) => Point`

Resolve a caret to the point that implicit insertion will use. Applies `inlineEdgeAffinity` first, then `leafEdgeAffinity`, with at most one move for each rule. Both default to `null`, which preserves the supplied point. The helper does not change the selection.

The rules apply to `editor.insertText`, `insertFragment` and insertion of inline elements with `insertNodes` only when `at` is omitted and the selection is collapsed. Explicit locations, expanded selections, and insertion of text or block nodes through `insertNodes` retain their existing behavior. IME composition remains native; these rules govern committed insertion.

#### `Editor.marks(editor: Editor) => Omit<Text, 'text'> | null`

Get the marks that would be added to text at the current selection.

At a collapsed caret with a non-null edge rule, returns the receiving leaf’s marks, unless explicit `editor.marks` are set. When both edge rules return `null`, the existing previous-leaf behavior at offset zero is preserved.

If `editor.marks` is set (marks toggled with a collapsed selection), those are returned. With an expanded selection, it returns the marks of the first text node in the selection, skipping a node the selection only touches at its end, so it describes what typing over the selection would produce rather than marks shared by the whole selection. To check whether a mark applies to all of the selected text, iterate `Editor.nodes(editor, { match: Text.isText })` and compare each node.

#### `Editor.next<T extends Descendant>(editor: Editor, options?) => NodeEntry<T> | undefined`

Get the matching node in the branch of the document after a location.

Note: To find the next Point, and not the next Node, use the `Editor.after` method

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

#### `Editor.node(editor: Editor, at: Location, options?) => NodeEntry`

Get the node at a location.

Options: `depth?: number, edge?: 'start' | 'end'`

#### `Editor.nodes<T extends Node>(editor: Editor, options?) => Generator<NodeEntry<T>, void, undefined>`

At any given `Location` or `Span` in the editor provided by `at` (default is the current selection), the method returns a Generator of `NodeEntry` objects that represent the nodes that include `at`. At the top of the hierarchy is the `Editor` object itself.

Options: `{at?: Location | Span, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', universal?: boolean, reverse?: boolean, voids?: boolean, pass?: (node: NodeEntry => boolean)}`

`options.match`: Provide a value to the `match?` option to limit the `NodeEntry` objects that are returned.

`options.mode`:

- `'all'` (default): Return all matching nodes
- `'highest'`: in a hierarchy of nodes, only return the highest level matching nodes
- `'lowest'`: in a hierarchy of nodes, only return the lowest level matching nodes

`options.pass`: Skip the descendants of certain nodes (but not the nodes themselves).

`options.reverse`: Walk siblings from last to first. Ancestors still come before their descendants, so this isn't the forward order reversed: for `[block[text a, text b], block[text c]]` the forward order is `editor, 0, 0.0, 0.1, 1, 1.0` and the reverse order is `editor, 1, 1.0, 0, 0.1, 0.0`. To get the exact reverse, collect the forward entries and reverse the array.

#### `Editor.parent(editor: Editor, at: Location, options?) => NodeEntry<Ancestor>`

Get the parent node of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.path(editor: Editor, at: Location, options?) => Path`

Get the path of a location.

Options: `{depth?: number, edge?: 'start' | 'end'}`

#### `Editor.point(editor: Editor, at: Location, options?) => Point`

Get the `start` or `end` (default is `start`) point of a location.

Options: `{edge?: 'start' | 'end'}`

#### `Editor.positions(editor: Editor, options?) => Generator<Point, void, undefined>`

Iterate through all of the positions in the document where a `Point` can be placed. The first `Point` returns is always the starting point followed by the next `Point` as determined by the `unit` option.

Read `options.unit` to see how this method iterates through positions.

Note: By default void nodes are treated as a single point and iteration will not happen inside their content unless the voids option is set, then iteration will occur. Text immediately after an inline void starts a new traversal boundary, including when the surrounding text is empty. Word traversal restarts segmentation at that boundary.

Options:

- `at?: Location = editor.selection`: The `Location` in which to iterate the positions of.
- `unit?: 'offset' | 'character' | 'word' | 'line' | 'block' = 'offset'`:
  - `offset`: Moves to the next offset `Point`. It will include the `Point` at the end of a `Text` object and then move onto the first `Point` (at the 0th offset) of the next `Text` object. This may be counter-intuitive because the end of a `Text` and the beginning of the next `Text` might be thought of as the same position.
  - `character`: Moves to the next `character` but is not always the next `index` in the string. This is because Unicode encodings may require multiple bytes to create one character. Unlike `offset`, `character` will not count the end of a `Text` and the beginning of the next `Text` as separate positions to return. Warning: The character offsets for Unicode characters does not appear to be reliable in some cases like a Smiley Emoji will be identified as 2 characters.
  - `word`: Moves to the position immediately after the next `word`. In `reverse` mode, moves to the position immediately before the previous `word`. Whitespace and punctuation end a word, and apostrophes inside a word don't. Where `Intl.Segmenter` is available, a run of word characters is split further at its word boundaries, so Chinese, Japanese and Thai text without spaces moves and deletes one word at a time.
  - `line` | `block`: Starts at the beginning position and then the position at the end of the block. Then starts at the beginning of the next block and then the end of the next block.
- `reverse?: boolean = false`: When `true` returns the positions in reverse order. In the case of the `unit` being `word`, the actual returned positions are different (i.e. we will get the start of a word in reverse instead of the end).
- `voids?: boolean = false`: When `true` include void Nodes.

For `unit: 'word'`, `isWordCharacter?: (character: string) => boolean` customizes word boundaries. The callback receives a whole grapheme, including a combined character or emoji. For example, `isWordCharacter: character => /[\w-]/.test(character)` treats `foo-bar_baz` as one word. A custom callback replaces the default punctuation rules and language segmentation; it is ignored for other units.

#### `Editor.previous<T extends Node>(editor: Editor, options?) => NodeEntry<T> | undefined`

Get the matching node in the branch of the document before a location.

Note: To find the previous Point, and not the previous Node, use the `Editor.before` method

Options: `{at?: Location, match?: NodeMatch, mode?: 'all' | 'highest' | 'lowest', voids?: boolean}`

#### `Editor.range(editor: Editor, at: Location, to?: Location) => Range`

Get a range of a location.

#### `Editor.start(editor: Editor, at: Location) => Point`

Get the start point of a location.

#### `Editor.string(editor: Editor, at: Location, options?) => string`

Get the text string content of a location.

Note: by default the text of void nodes is considered to be an empty string, regardless of content, unless the voids option is set.

Options: : `{voids?: boolean}`

#### `Editor.void(editor: Editor, options?) => NodeEntry<Element> | undefined`

Match a void node in the current branch of the editor.

Options: `{at?: Location, mode?: 'highest' | 'lowest', voids?: boolean}`

#### `Editor.word(editor: Editor, options?) => Range | undefined`

Get the range of the word around a point, within its block. Defaults to the selection's focus. Returns `undefined` when the point isn't touching a word, is inside a void, or there is no selection.

The word can span text nodes with different marks and inline elements such as links, but stops at inline voids. By default it finds the same words as the `'word'` unit that word deletion and `Editor.before`/`Editor.after` use. Whitespace and punctuation end a word, and apostrophes inside a word don't. Where `Intl.Segmenter` is available, Chinese, Japanese and Thai text without spaces is split into its words. Pass `isWordCharacter` to define your own, for example to treat `foo-bar.baz` or `@name` as one word:

```javascript
const range = Editor.word(editor, {
  isWordCharacter: character => /[\w.@-]/.test(character),
})
const word = range && Editor.string(editor, range)
```

Options: `{at?: Point | Range, isWordCharacter?: (character: string) => boolean}`

`Editor.word` reads the editor's value, which doesn't include text an input method is still composing. In React, use [`ReactEditor.getWord`](../../libraries/slate-react/react-editor.md) to include it.

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

A hanging selection from the start of a block to the start of a following sibling removes the fully selected blocks, preserving the following block. Inside an element identified by `editor.isIsolated`, deletion continues to unhang the selection and retain the block structure. Custom `deleteFragment` overrides still control deletion.

#### `Editor.insertBreak(editor: Editor) => void`

Insert a block break at the current selection.

#### `Editor.insertSoftBreak(editor: Editor) => void`

Insert a soft break at the current selection.

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

#### `Editor.hasRange(editor: Editor, range: Range) => boolean`

Check whether both endpoint paths of a range exist in the editor. This checks paths, not whether offsets are within the text. `DOMEditor.hasRange` and `ReactEditor.hasRange` delegate to this method.

#### `Editor.hasBlocks(editor: Editor, element: Element) => boolean`

Check if a node has block children.

#### `Editor.hasInlines(editor: Editor, element: Element) => boolean`

Check if a node has inline and text children.

#### `Editor.hasTexts(editor: Editor, element: Element) => boolean`

Check if a node has text children.

#### `Editor.isBlock(editor: Editor, element: Element) => boolean`

Check if an element is a block element. It only accepts an `Element`, so check other values with `Element.isElement` first.

#### `Editor.isEditor(value: any) => value is Editor`

Check if a value is an `Editor` object.

#### `Editor.isEnd(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is the end point of a location.

#### `Editor.isEdge(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is an edge of a location.

#### `Editor.isEmpty(editor: Editor, element: Element) => boolean`

Check if an element is empty, accounting for void nodes.

#### `Editor.isInline(editor: Editor, element: Element) => boolean`

Check if an element is an inline element. It only accepts an `Element`, so check other values with `Element.isElement` first.

#### `Editor.isNormalizing(editor: Editor) => boolean`

Check if the editor is currently normalizing after each operation.

#### `Editor.isRemoteChange(editor: Editor) => boolean`

Check whether the editor is currently inside `Editor.withRemoteChanges`. It returns `false` outside that editor's scope.

#### `Editor.isStart(editor: Editor, point: Point, at: Location) => boolean`

Check if a point is the start point of a location.

#### `Editor.isVoid(editor: Editor, element: Element) => boolean`

Check if an element is a void element. It only accepts an `Element`, so check other values with `Element.isElement` first.

### Normalization methods

#### `Editor.normalize(editor: Editor, options?) => void`

Normalize any dirty objects in the editor.

Options: `{force?: boolean; operation?: Operation}`

#### `Editor.withoutNormalizing(editor: Editor, fn: () => void) => void`

Call a function, deferring normalization until after it completes.
See [Normalization - Implications for Other Code](../../concepts/11-normalizing.md#implications-for-other-code);

### Remote operations

#### `Editor.withRemoteChanges(editor: Editor, fn: () => void) => void`

Apply remote operations inside a synchronous callback. An expanded selection uses inward affinity, so text inserted at either edge stays outside the selected content. Collapsed carets keep their usual forward behavior. Local operations outside the scope retain their existing selection behavior.

Scopes can nest and restore the previous flag even if the callback throws. The scope covers only the synchronous callback; apply asynchronous updates inside a new scope when they arrive. This helper does not synchronize operations or change history saving. Removing a selected node keeps the existing nearest-point fallback.

```typescript
Editor.withRemoteChanges(editor, () => {
  Editor.withoutNormalizing(editor, () => {
    for (const operation of remoteOperations) editor.apply(operation)
  })
})
```

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

#### `inlineEdgeAffinity(element: Element, edge: 'start' | 'end') => 'inside' | 'outside' | null`

Choose whether insertion at an inline edge belongs inside the inline or in the adjacent text outside it. The rule also applies when the caret names that adjacent text. Defaults to `null`, retaining the current point. An `'inside'` rule never moves a caret into a void, read-only, or non-selectable inline.

At shared boundaries, the outermost inline edge takes precedence. Between adjacent inlines separated by empty text, rules are considered from left to right; the first non-null rule wins. Empty non-void inlines use their start edge, and an outside rule uses the text before the empty inline. These tie rules keep repeated resolution stable.

#### `leafEdgeAffinity(before: Text, after: Text) => 'backward' | 'forward' | null`

Choose which of two sibling text leaves receives insertion at their shared boundary. `'backward'` uses the end of `before`; `'forward'` uses the start of `after`. Defaults to `null`, retaining the current point. This rule runs after inline affinity and determines the receiving leaf’s marks reported by `Editor.marks`.

#### `isIsolated(element: Element) => boolean`

Mark elements whose content must not flow across their edges, such as table cells. Slate's default returns `false`.

For an isolated element:

- Backspace at its start and Delete at its end do nothing, so they don't merge it with a neighbour. Deleting by word or line stops at its edge.
- Deleting a range that crosses its edge removes the selected text but doesn't merge the blocks on either side. Isolated elements that are entirely inside the range are still removed.
- `insertBreak`, and `splitNodes` with its default match, don't split it. They still split blocks inside it. `splitNodes` with an explicit `match` that selects the element still splits it.
- Explicit `mergeNodes` calls aren't affected.

```javascript
const { isIsolated } = editor
editor.isIsolated = element =>
  element.type === 'table-cell' || isIsolated(element)
```

### Normalize methods

#### `normalizeNode(entry: NodeEntry, { operation, fallbackElement }) => void`

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

#### `getFragment() => Descendant[]`

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
