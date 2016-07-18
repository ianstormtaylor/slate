
# `Transform`

```js
import { Transform } from 'slate'
```

A transform allows you to define a series of changes you'd like to make to the current [`Document`](./document.md) or [`Selection`](./selection.md) in a [`State`](./state.md).

All changes are performed through `Transform` objects, so that a history of changes can be preserved for use in undo/redo operations, and to make collaborative editing possible.

Transform methods can either operate on the [`Document`](./document.md), the [`Selection`](./selection.md), or both at once.

- [Document & Selection Transforms](#document-selection-transforms)
  - [`deleteBackward`](#deletebackward)
  - [`deleteForward`](#deleteforward)
  - [`delete`](#delete)
  - [`insertFragment`](#insertfragment)
  - [`insertText`](#inserttext)
  - [`addMark`](#addmark)
  - [`setBlock`](#setblock)
  - [`setInline`](#setinline)
  - [`splitBlock`](#splitblock)
  - [`splitInline`](#splitinline)
  - [`removeMark`](#removemark)
  - [`unwrapBlock`](#unwrapblock)
  - [`unwrapInline`](#unwrapinline)
  - [`wrapBlock`](#wrapblock)
  - [`wrapInline`](#wrapinline)
- [Selection Transforms](#selection-transforms)
  - [`blur`](#blur)
  - [`collapseTo{Edge}Of`](#collapsetoedgeof)
  - [`collapseTo{Edge}Of{Direction}Block`](#collapsetoedgeofdirectionblock)
  - [`collapseTo{Edge}Of{Direction}Text`](#collapsetoedgeofdirectiontext)
  - [`collapseTo{Edge}`](#collapsetoedge)
  - [`extendTo{Edge}Of`](#extendtoedgeof)
  - [`extend{Direction}`](#extenddirection)
  - [`focus`](#focus)
  - [`moveToOffsets`](#movetooffsets)
  - [`moveToRangeOf`](#movetorangeof)
  - [`moveTo`](#moveto)
  - [`move{Direction}`](#movedirection)
- [Document Transforms](#document-transforms)
  - [`deleteAtRange`](#deleteatrange)
  - [`deleteBackwardAtRange`](#deletebackwardatrange)
  - [`deleteForwardAtRange`](#deleteforwardatrange)
  - [`insertFragmentAtRange`](#insertfragmentatrange)
  - [`insertTextAtRange`](#inserttextatrange)
  - [`addMarkAtRange`](#addmarkatrange)
  - [`setBlockAtRange`](#setblockatrange)
  - [`setInlineAtRange`](#setinlineatrange)
  - [`splitBlockAtRange`](#splitblockatrange)
  - [`splitInlineAtRange`](#splitinlineatrange)
  - [`removeMarkAtRange`](#removeMarkatrange)
  - [`unwrapBlockAtRange`](#unwrapblockatrange)
  - [`unwrapInlineAtRange`](#unwrapinlineatrange)
  - [`wrapBlockAtRange`](#wrapblockatrange)
  - [`wrapInlineAtRange`](#wrapinlineatrange)







## Document & Selection Transforms

### `deleteBackward`
`deleteBackward(n: Number) => Transform`

Delete backward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForward`
`deleteForward(n: Number) => Transform`

Delete forward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `delete`
`delete() => Transform`

Delete everything in the current selection.

### `insertFragment`
`insertFragment(fragment: Document) => Transform`

Insert a `fragment` at the current selection. If the selection is expanded, it will be deleted first.

### `insertText`
`insertText(text: String) => Transform`

Insert a string of `text` at the current selection. If the selection is expanded, it will be deleted first.

### `addMark`
`addMark(mark: Mark) => Transform`
`addMark(type: String) => Transform`

Add a [`mark`](./mark.md) to the characters in the current selection. For convenience, you can pass a `type` string to implicitly create a [`Mark`](./mark.md) of that type.

### `setBlock`
`setBlock(properties: Object) => Transform`
`setBlock(type: String) => Transform`

Set the `properties` of the [`Block`](./block.md) in the current selection. For convenience, you can pass a `type` string to set the blocks's type only.

### `setInline`
`setInline(properties: Object) => Transform`
`setInline(type: String) => Transform`

Set the `properties` of the [`Inline`](./inline.md) nodes in the current selection. For convenience, you can pass a `type` string to set the inline's type only.

### `splitBlock`
`splitBlock(depth: Number) => Transform`

Split the [`Block`](./block.md) in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInline`
`splitInline(depth: Number) => Transform`

Split the [`Inline`](./inline.md) node in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMark`
`removeMark(mark: Mark) => Transform`
`removeMark(type: String) => Transform`

Remove a [`mark`](./mark.md) from the characters in the current selection. For convenience, you can pass a `type` string to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlock`
`unwrapBlock([type: String], [data: Data]) => Transform`

Unwrap all [`Block`](./block.md) nodes in the current selection that match a `type` and/or `data`.

### `unwrapInline`
`unwrapInline([type: String], [data: Data]) => Transform`

Unwrap all [`Inline`](./inline.md) nodes in the current selection that match a `type` and/or `data`.

### `wrapBlock`
`wrapBlock(type: String, [data: Data]) => Transform`

Wrap the [`Block`](./block.md) nodes in the current selection with a new [`Block`](./block.md) node of `type`, with optional `data`.

### `wrapInline`
`wrapInline(type: String, [data: Data]) => Transform`

Wrap the [`Inline`](./inline.md) nodes in the current selection with a new [`Inline`](./inline.md) node of `type`, with optional `data`.


## Selection Transforms

### `blur`
`blur() => Transform`

Blur the current selection.

### `collapseTo{Edge}`
`collapseTo{Edge}() => Transform`

Collapse the current selection to its `{Edge}`. Where `{Edge}` is either `Anchor`, `Focus`, `Start` or `End`.

### `collapseTo{Edge}Of`
`collapseTo{Edge}Of(node: Node) => Transform`

Collapse the current selection to the `{Edge}` of `node`. Where `{Edge}` is either `Start` or `End`.

### `collapseTo{Edge}Of{Direction}Block`
`collapseTo{Edge}Of{Direction}Block() => Transform`

Collapse the current selection to the `{Edge}` of the next [`Block`](./block.md) node in `{Direction}`. Where `{Edge}` is either `{Start}` or `{End}` and `{Direction}` is either `Next` or `Previous`.

### `collapseTo{Edge}Of{Direction}Text`
`collapseTo{Edge}Of{Direction}Text() => Transform`

Collapse the current selection to the `{Edge}` of the next [`Text`](./text.md) node in `{Direction}`. Where `{Edge}` is either `{Start}` or `{End}` and `{Direction}` is either `Next` or `Previous`.

### `extend{Direction}`
`extend{Direction}(n: Number) => Transform`

Extend the current selection's points `n` characters in `{Direction}`. Where `{Direction}` is either `Backward` or `Forward`.

### `extendTo{Edge}Of`
`extendTo{Edge}Of(node: Node) => Transform`

Extend the current selection to the `{Edge}` of a `node`. Where `{Edge}` is either `Start` or `End`.

### `focus`
`focus() => Transform`

Focus the current selection.

### `move{Direction}`
`move{Direction}(n: Number) => Transform`

Move the current selection's points  `n` characters in `{Direction}`. Where `{Direction}` is either `Backward` or `Forward`.

### `moveToOffsets`
`moveToOffsets(anchorOffset: Number, focusOffset: Number) => Transform`

Move the current selection's offsets to a new `anchorOffset` and `focusOffset`.

### `moveToRangeOf`
`moveToRangeOf(node: Node) => Transform`

Move the current selection's anchor point to the start of a `node` and its focus point to the end of the `node`.

### `moveTo`
`moveTo(properties: Object) => Transform`

Move the current selection to a selection with merged `properties`.


## Document Transforms

### `deleteBackwardAtRange`
`deleteBackwardAtRange(range: Selection, n: Number) => Transform`

Delete backward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForwardAtRange`
`deleteForwardAtRange(range: Selection, n: Number) => Transform`

Delete forward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteAtRange`
`deleteAtRange(range: Selection, ) => Transform`

Delete everything in a `range`.

### `insertFragmentAtRange`
`insertFragmentAtRange(range: Selection, fragment: Document) => Transform`

Insert a `fragment` at a `range`. If the selection is expanded, it will be deleted first.

### `insertTextAtRange`
`insertTextAtRange(range: Selection, text: String) => Transform`

Insert a string of `text` at a `range`. If the selection is expanded, it will be deleted first.

### `addMarkAtRange`
`addMarkAtRange(range: Selection, mark: Mark) => Transform`
`addMark(range: Selection, type: String) => Transform`

Add a [`mark`](./mark.md) to the characters in a `range`. For convenience, you can pass a `type` string to implicitly create a [`Mark`](./mark.md) of that type.

### `setBlockAtRange`
`setBlockAtRange(range: Selection, properties: Object) => Transform`
`setBlock(range: Selection, type: String) => Transform`

Set the `properties` of the [`Block`](./block.md) in a `range`. For convenience, you can pass a `type` string to set the blocks's type only.

### `setInlineAtRange`
`setInlineAtRange(range: Selection, properties: Object) => Transform`
`setInline(range: Selection, type: String) => Transform`

Set the `properties` of the [`Inline`](./inline.md) nodes in a `range`. For convenience, you can pass a `type` string to set the inline's type only.

### `splitBlockAtRange`
`splitBlockAtRange(range: Selection, depth: Number) => Transform`

Split the [`Block`](./block.md) in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInlineAtRange`
`splitInlineAtRange(range: Selection, depth: Number) => Transform`

Split the [`Inline`](./inline.md) node in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMarkAtRange`
`removeMarkAtRange(range: Selection, mark: Mark) => Transform`
`removeMark(range: Selection, type: String) => Transform`

Remove a [`mark`](./mark.md) from the characters in a `range`. For convenience, you can pass a `type` string to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlockAtRange`
`unwrapBlockAtRange(range: Selection, [type: String], [data: Data]) => Transform`

Unwrap all [`Block`](./block.md) nodes in a `range` that match a `type` and/or `data`.

### `unwrapInlineAtRange`
`unwrapInlineAtRange(range: Selection, [type: String], [data: Data]) => Transform`

Unwrap all [`Inline`](./inline.md) nodes in a `range` that match a `type` and/or `data`.

### `wrapBlockAtRange`
`wrapBlockAtRange(range: Selection, type: String, [data: Data]) => Transform`

Wrap the [`Block`](./block.md) nodes in a `range` with a new [`Block`](./block.md) node of `type`, with optional `data`.

### `wrapInlineAtRange`
`wrapInlineAtRange(range: Selection, type: String, [data: Data]) => Transform`

Wrap the [`Inline`](./inline.md) nodes in a `range` with a new [`Inline`](./inline.md) node of `type`, with optional `data`.


