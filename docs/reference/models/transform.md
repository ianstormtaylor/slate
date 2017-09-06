
# `Change`

```js
import { Change } from 'slate'
```

A change allows you to define a series of changes you'd like to make to the current [`Document`](./document.md) or [`Selection`](./selection.md) in a [`State`](./state.md).

All changes are performed through `Change` objects, so that a history of changes can be preserved for use in undo/redo operations, and to make collaborative editing possible.

Change methods can either operate on the [`Document`](./document.md), the [`Selection`](./selection.md), or both at once.

- [Properties](#properties)
  - [`state`](#state)
- [Methods](#methods)
  - [`apply`](#apply)
  - [`call`](#call)
- [Current State Changes](#current-state-changes)
  - [`deleteBackward`](#deletebackward)
  - [`deleteForward`](#deleteforward)
  - [`delete`](#delete)
  - [`insertBlock`](#insertblock)
  - [`insertFragment`](#insertfragment)
  - [`insertInline`](#insertinline)
  - [`insertText`](#inserttext)
  - [`addMark`](#addmark)
  - [`setBlock`](#setblock)
  - [`setInline`](#setinline)
  - [`splitBlock`](#splitblock)
  - [`splitInline`](#splitinline)
  - [`removeMark`](#removemark)
  - [`toggleMark`](#togglemark)
  - [`unwrapBlock`](#unwrapblock)
  - [`unwrapInline`](#unwrapinline)
  - [`wrapBlock`](#wrapblock)
  - [`wrapInline`](#wrapinline)
  - [`wrapText`](#wraptext)
- [Selection Changes](#selection-changes)
  - [`blur`](#blur)
  - [`collapseTo{Edge}Of`](#collapsetoedgeof)
  - [`collapseTo{Edge}Of{Direction}Block`](#collapsetoedgeofdirectionblock)
  - [`collapseTo{Edge}Of{Direction}Text`](#collapsetoedgeofdirectiontext)
  - [`collapseTo{Edge}`](#collapsetoedge)
  - [`extendTo{Edge}Of`](#extendtoedgeof)
  - [`extend`](#extend)
  - [`flip`](#flip)
  - [`focus`](#focus)
  - [`move`](#move)
  - [`move{Edge}`](#moveedge)
  - [`moveOffsetsTo`](#moveoffsetsto)
  - [`moveToRangeOf`](#movetorangeof)
  - [`select`](#select)
  - [`selectAll`](#selectall)
  - [`deselect`](#deselect)
- [Node Changes](#node-changes)
  - [`addMarkByKey`](#addmarkbykey)
  - [`insertNodeByKey`](#insertnodebykey)
  - [`insertFragmentByKey`](#insertfragmentbykey)
  - [`insertTextByKey`](#inserttextbykey)
  - [`moveNodeByKey`](#movenodebykey)
  - [`removeMarkByKey`](#removemarkbykey)
  - [`removeNodeByKey`](#removenodebykey)
  - [`removeTextByKey`](#removetextbykey)
  - [`setMarkByKey`](#setmarkbykey)
  - [`setNodeByKey`](#setnodebykey)
  - [`splitNodeByKey`](#splitnodebykey)
  - [`unwrapInlineByKey`](#unwrapinlinebykey)
  - [`unwrapBlockByKey`](#unwrapblockbykey)
  - [`unwrapNodeByKey`](#unwrapnodebykey)
  - [`wrapBlockByKey`](#wrapblockbykey)
  - [`wrapInlineByKey`](#wrapinlinebykey)
- [Document Changes](#document-changes)
  - [`deleteAtRange`](#deleteatrange)
  - [`deleteBackwardAtRange`](#deletebackwardatrange)
  - [`deleteForwardAtRange`](#deleteforwardatrange)
  - [`insertBlockAtRange`](#insertblockatrange)
  - [`insertFragmentAtRange`](#insertfragmentatrange)
  - [`insertInlineAtRange`](#insertinlineatrange)
  - [`insertTextAtRange`](#inserttextatrange)
  - [`addMarkAtRange`](#addmarkatrange)
  - [`setBlockAtRange`](#setblockatrange)
  - [`setInlineAtRange`](#setinlineatrange)
  - [`splitBlockAtRange`](#splitblockatrange)
  - [`splitInlineAtRange`](#splitinlineatrange)
  - [`removeMarkAtRange`](#removemarkatrange)
  - [`toggleMarkAtRange`](#togglemarkatrange)
  - [`unwrapBlockAtRange`](#unwrapblockatrange)
  - [`unwrapInlineAtRange`](#unwrapinlineatrange)
  - [`wrapBlockAtRange`](#wrapblockatrange)
  - [`wrapInlineAtRange`](#wrapinlineatrange)
  - [`wrapTextAtRange`](#wraptextatrange)
- [History Changes](#history-changes)
  - [`redo`](#redo)
  - [`undo`](#undo)


## Properties

### `state`

A [`State`](./state.md) with the change's current operations applied. Each time you run a new change function this property will be updated.


## Methods

### `apply`
`apply(options: Object) => Change`

Applies current change steps, saving them to the history if needed.

### `call`
`call(customChange: Function, ...arguments) => Change`

This method calls the provided function argument `customChange` with the current instance of the `Change` object as the first argument and passes through the remaining arguments.

The function signature for `customChange` is:

`customChange(change: Change, ...arguments)`

The purpose of `call` is to enable custom change methods to exist and called in a chain. For example:

```
return state.change()
  .call(myCustomInsertTableChange, columns, rows)
  .focus()
  .apply()
```

## Current State Changes

### `deleteBackward`
`deleteBackward(n: Number) => Change`

Delete backward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForward`
`deleteForward(n: Number) => Change`

Delete forward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `delete`
`delete() => Change`

Delete everything in the current selection.

### `insertBlock`
`insertBlock(block: Block) => Change` <br/>
`insertBlock(properties: Object) => Change` <br/>
`insertBlock(type: String) => Change`

Insert a new block at the same level as the current block, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragment`
`insertFragment(fragment: Document) => Change`

Insert a [`fragment`](./document.md) at the current selection. If the selection is expanded, it will be deleted first.

### `insertInline`
`insertInline(inline: Inline) => Change` <br/>
`insertInline(properties: Object) => Change`

Insert a new inline at the current cursor position, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertText`
`insertText(text: String) => Change`

Insert a string of `text` at the current selection. If the selection is expanded, it will be deleted first.

### `addMark`
`addMark(mark: Mark) => Change` <br/>
`addMark(properties: Object) => Change` <br/>
`addMark(type: String) => Change`

Add a [`mark`](./mark.md) to the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `setBlock`
`setBlock(properties: Object) => Change` <br/>
`setBlock(type: String) => Change`

Set the `properties` of the [`Block`](./block.md) in the current selection. For convenience, you can pass a `type` string to set the blocks's type only.

### `setInline`
`setInline(properties: Object) => Change` <br/>
`setInline(type: String) => Change`

Set the `properties` of the [`Inline`](./inline.md) nodes in the current selection. For convenience, you can pass a `type` string to set the inline's type only.

### `splitBlock`
`splitBlock(depth: Number) => Change`

Split the [`Block`](./block.md) in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInline`
`splitInline(depth: Number) => Change`

Split the [`Inline`](./inline.md) node in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMark`
`removeMark(mark: Mark) => Change` <br/>
`removeMark(properties: Object) => Change` <br/>
`removeMark(type: String) => Change`

Remove a [`mark`](./mark.md) from the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMark`
`toggleMark(mark: Mark) => Change` <br/>
`toggleMark(properties: Object) => Change` <br/>
`toggleMark(type: String) => Change`

Add or remove a [`mark`](./mark.md) from the characters in the current selection, depending on it already exists on any or not. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlock`
`unwrapBlock([type: String], [data: Data]) => Change`

Unwrap all [`Block`](./block.md) nodes in the current selection that match a `type` and/or `data`.

### `unwrapInline`
`unwrapInline([type: String], [data: Data]) => Change`

Unwrap all [`Inline`](./inline.md) nodes in the current selection that match a `type` and/or `data`.

### `wrapBlock`
`wrapBlock(type: String, [data: Data]) => Change`

Wrap the [`Block`](./block.md) nodes in the current selection with a new [`Block`](./block.md) node of `type`, with optional `data`.

### `wrapInline`
`wrapInline(type: String, [data: Data]) => Change`

Wrap the [`Inline`](./inline.md) nodes in the current selection with a new [`Inline`](./inline.md) node of `type`, with optional `data`.

### `wrapText`
`wrapText(prefix: String, [suffix: String]) => Change`

Surround the text in the current selection with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.


## Selection Changes

### `blur`
`blur() => Change`

Blur the current selection.

### `collapseTo{Edge}`
`collapseTo{Edge}() => Change`

Collapse the current selection to its `{Edge}`. Where `{Edge}` is either `Anchor`, `Focus`, `Start` or `End`.

### `collapseTo{Edge}Of`
`collapseTo{Edge}Of(node: Node) => Change`

Collapse the current selection to the `{Edge}` of `node`. Where `{Edge}` is either `Start` or `End`.

### `collapseTo{Edge}Of{Direction}Block`
`collapseTo{Edge}Of{Direction}Block() => Change`

Collapse the current selection to the `{Edge}` of the next [`Block`](./block.md) node in `{Direction}`. Where `{Edge}` is either `{Start}` or `{End}` and `{Direction}` is either `Next` or `Previous`.

### `collapseTo{Edge}Of{Direction}Text`
`collapseTo{Edge}Of{Direction}Text() => Change`

Collapse the current selection to the `{Edge}` of the next [`Text`](./text.md) node in `{Direction}`. Where `{Edge}` is either `{Start}` or `{End}` and `{Direction}` is either `Next` or `Previous`.

### `extend`
`extend(n: Number) => Change`

Extend the current selection's points by `n` characters. `n` can be positive or negative to indicate direction.

### `extendTo{Edge}Of`
`extendTo{Edge}Of(node: Node) => Change`

Extend the current selection to the `{Edge}` of a `node`. Where `{Edge}` is either `Start` or `End`.

### `flip`
`flip() => Change`

Flip the selection.

### `focus`
`focus() => Change`

Focus the current selection.

### `move`
`move(n: Number) => Change`

Move the current selection's offsets by  `n`.

### `move{Edge}`
`move{Edge}(n: Number) => Change`

Move the current selection's `edge` offset by  `n`. `edge` can be one of `Start`, `End`.

### `moveOffsetsTo`
`moveOffsetsTo(anchorOffset: Number, focusOffset: Number) => Change`

Move the current selection's offsets to a new `anchorOffset` and `focusOffset`.

### `moveToRangeOf`
`moveToRangeOf(node: Node) => Change`

Move the current selection's anchor point to the start of a `node` and its focus point to the end of the `node`.

### `select`
`select(properties: Selection || Object) => Change`

Set the current selection to a selection with merged `properties`. The `properties` can either be a [`Selection`](./selection.md) object or a plain Javascript object of selection properties.

### `selectAll`
`selectAll() => Change`

Select the entire document and focus the selection.

### `deselect`
`deselect() => Change`

Unset the selection.


## Node Changes

### `addMarkByKey`
`addMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`

Add a `mark` to `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key`.

### `insertNodeByKey`
`insertNodeByKey(key: String, index: Number, node: Node) => Change`

Insert a `node` at `index` inside a parent [`Node`](./node.md) by its `key`.

### `insertFragmentByKey`
`insertFragmentByKey(key: String, index: Number, fragment: Fragment) => Transform`

Insert a [`Fragment`](./fragment.md) at `index` inside a parent [`Node`](./node.md) by its `key`.

### `insertTextByKey`
`insertTextByKey(key: String, offset: Number, text: String, [marks: Set]) => Change`

Insert `text` at an `offset` in a [`Text Node`](./text.md) with optional `marks`.

### `moveNodeByKey`
`moveNodeByKey(key: String, newKey: String, newIndex: Number) => Change`

Move a [`Node`](./node.md) by its `key` to a new parent node with its `newKey` and at a `newIndex`.

### `removeMarkByKey`
`removeMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`

Remove a `mark` from `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key`.

### `removeNodeByKey`
`removeNodeByKey(key: String) => Change`

Remove a [`Node`](./node.md) from the document by its `key`.

### `removeTextByKey`
`removeTextByKey(key: String, offset: Number, length: Number) => Change`

Remove `length` characters of text starting at an `offset` in a [`Node`](./node.md) by its `key`.

### `setMarkByKey`
`setMarkByKey(key: String, offset: Number, length: Number, mark: Mark, properties: Object) => Change`

Set a dictionary of `properties` on a [`mark`](./mark.md) on a [`Node`](./node.md) by its `key`.

### `setNodeByKey`
`setNodeByKey(key: String, properties: Object) => Change` <br/>
`setNodeByKey(key: String, type: String) => Change`

Set a dictionary of `properties` on a [`Node`](./node.md) by its `key`. For convenience, you can pass a `type` string or `properties` object.

### `splitNodeByKey`
`splitNodeByKey(key: String, offset: Number) => Change`

Split a node by its `key` at an `offset`.

### `unwrapInlineByKey`
`unwrapInlineByKey(key: String, properties: Object) => Change` <br/>
`unwrapInlineByKey(key: String, type: String) => Change`

Unwrap all inner content of an [`Inline`](./inline.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapBlockByKey`
`unwrapBlockByKey(key: String, properties: Object) => Change` <br/>
`unwrapBlockByKey(key: String, type: String) => Change`

Unwrap all inner content of a [`Block`](./block.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapNodeByKey`
`unwrapNodeByKey(key: String) => Change`

Unwrap a single node from its parent. If the node is surrounded with siblings, its parent will be split. If the node is the only child, the parent is removed, and simply replaced by the node itself. Cannot unwrap a root node.

### `wrapBlockByKey`
`wrapBlockByKey(key: String, properties: Object) => Change` <br/>
`wrapBlockByKey(key: String, type: String) => Change`

Wrap the given node in a [`Block`](./block.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineByKey`
`wrapInlineByKey(key: String, properties: Object) => Change` <br/>
`wrapInlineByKey(key: String, type: String) => Change`

Wrap the given node in a [`Inline`](./inline.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

## Document Changes

### `deleteBackwardAtRange`
`deleteBackwardAtRange(range: Selection, n: Number) => Change`

Delete backward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForwardAtRange`
`deleteForwardAtRange(range: Selection, n: Number) => Change`

Delete forward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteAtRange`
`deleteAtRange(range: Selection, ) => Change`

Delete everything in a `range`.

### `insertBlockAtRange`
`insertBlockAtRange(range: Selection, block: Block) => Change` <br/>
`insertBlockAtRange(range: Selection, properties: Object) => Change` <br/>
`insertBlockAtRange(range: Selection, type: String) => Change`

Insert a new block at the same level as the leaf block at a `range`, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragmentAtRange`
`insertFragmentAtRange(range: Selection, fragment: Document) => Change`

Insert a [`fragment`](./document.md) at a `range`. If the selection is expanded, it will be deleted first.

### `insertInlineAtRange`
`insertInlineAtRange(range: Selection, inline: Inline) => Change` <br/>
`insertInlineAtRange(range: Selection, properties: Object) => Change`

Insert a new inline at a `range`, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertTextAtRange`
`insertTextAtRange(range: Selection, text: String) => Change`

Insert a string of `text` at a `range`. If the selection is expanded, it will be deleted first.

### `addMarkAtRange`
`addMarkAtRange(range: Selection, mark: Mark) => Change` <br/>
`addMarkAtRange(range: Selection, properties: Object) => Change` <br/>
`addMarkAtRange(range: Selection, type: String) => Change`

Add a [`mark`](./mark.md) to the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `setBlockAtRange`
`setBlockAtRange(range: Selection, properties: Object) => Change` <br/>
`setBlock(range: Selection, type: String) => Change`

Set the `properties` of the [`Block`](./block.md) in a `range`. For convenience, you can pass a `type` string to set the blocks's type only.

### `setInlineAtRange`
`setInlineAtRange(range: Selection, properties: Object) => Change` <br/>
`setInline(range: Selection, type: String) => Change`

Set the `properties` of the [`Inline`](./inline.md) nodes in a `range`. For convenience, you can pass a `type` string to set the inline's type only.

### `splitBlockAtRange`
`splitBlockAtRange(range: Selection, depth: Number) => Change`

Split the [`Block`](./block.md) in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInlineAtRange`
`splitInlineAtRange(range: Selection, depth: Number) => Change`

Split the [`Inline`](./inline.md) node in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMarkAtRange`
`removeMarkAtRange(range: Selection, mark: Mark) => Change` <br/>
`removeMarkAtRange(range: Selection, properties: Object) => Change` <br/>
`removeMarkAtRange(range: Selection, type: String) => Change`

Remove a [`mark`](./mark.md) from the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMarkAtRange`
`toggleMarkAtRange(range: Selection, mark: Mark) => Change` <br/>
`toggleMarkAtRange(range: Selection, properties: Object) => Change` <br/>
`toggleMarkAtRange(range: Selection, type: String) => Change`

Add or remove a [`mark`](./mark.md) from the characters in a `range`, depending on whether any of them already have the mark. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlockAtRange`
`unwrapBlockAtRange(range: Selection, properties: Object) => Change` <br/>
`unwrapBlockAtRange(range: Selection, type: String) => Change`

Unwrap all [`Block`](./block.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapInlineAtRange`
`unwrapInlineAtRange(range: Selection, properties: Object) => Change` <br/>
`unwrapInlineAtRange(range: Selection, type: String) => Change`

Unwrap all [`Inline`](./inline.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapBlockAtRange`
`wrapBlockAtRange(range: Selection, properties: Object) => Change` <br/>
`wrapBlockAtRange(range: Selection, type: String) => Change`

Wrap the [`Block`](./block.md) nodes in a `range` with a new [`Block`](./block.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineAtRange`
`wrapInlineAtRange(range: Selection, properties: Object) => Change` <br/>
`wrapInlineAtRange(range: Selection, type: String) => Change`

Wrap the [`Inline`](./inline.md) nodes in a `range` with a new [`Inline`](./inline.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapTextAtRange`
`wrapTextAtRange(range: Selection, prefix: String, [suffix: String]) => Change`

Surround the text in a `range` with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.


## History Changes

### `redo`
`redo() => Change`

Move forward one step in the history.

### `undo`
`undo() => Change`

Move backward one step in the history.
