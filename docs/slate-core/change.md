# Change

```javascript
import { Change } from 'slate'
```

A change allows you to define a series of changes you'd like to make to the current [`Value`](value.md).

All changes are performed through `Change` objects, so that a history of changes can be preserved for use in undo/redo operations, and to make collaborative editing possible.

## Properties

### `object`

`String`

A string with a value of `'change'`.

### `value`

A [`Value`](value.md) with the change's current operations applied. Each time you run a new change function this property will be updated.

## Methods

### `call`

`call(customChange: Function, ...args) => Change`

This method calls the provided `customChange` function with the current instance of the `Change` object as the first argument and passes through the remaining `args`.

The purpose of `call` is to enable custom change methods to exist and called in a chain. For example:

```javascript
function addBoldMark(change) {
  change.addMark('bold_mark')
}

function insertParagraph(change) {
  change.insertBlock('paragraph_block')
}

function onSomeEvent(event, change) {
  change
    .call(insertParagraph)
    .insertText('Some text...')
    .extendToStartOfBlock()
    .call(addBoldMark)
    .collapseToEnd()
}
```

### `withoutNormalization`

`withoutNormalization(customChange: Function) => Change`

This method calls the provided `customChange` function with the current instance of the `Change` object as the first argument. While `customChange` is executing, normalization is temporarily suppressed, but normalization will be executed once the `customChange` function completes execution.

The purpose of `withoutNormalization` is to allow a sequence of change operations that should not be interrupted by normalization. For example:

```javascript
/**
 * Only allow block nodes in documents.
 *
 * @type {Object}
 */
validateNode(node) {
  if (node.object != 'document') return
  const invalids = node.nodes.filter(n => n.object != 'block')
  if (!invalids.size) return

  return (change) => {
    change.withoutNormalization((c) => {
      invalids.forEach((child) => {
        c.removeNodeByKey(child.key)
      })
    })
  }
}
```

## Current Value Changes

These changes act on the `document` based on the current `selection`. They are equivalent to calling the [Document Changes](change.md#document-changes) with the current selection as the `range` argument, but they are there for convenience, since you often want to act with the current selection, as a user would.

### `deleteBackward`

`deleteBackward(n: Number) => Change`

Delete backward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](change.md#delete). `n` defaults to `1`.

### `deleteForward`

`deleteForward(n: Number) => Change`

Delete forward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](change.md#delete). `n` defaults to `1`.

### `delete`

`delete() => Change`

Delete everything in the current selection.

### `insertBlock`

`insertBlock(block: Block) => Change`   
  
`insertBlock(properties: Object) => Change`   
  
`insertBlock(type: String) => Change`

Insert a new block at the same level as the current block, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragment`

`insertFragment(fragment: Document) => Change`

Insert a [`fragment`](document.md) at the current selection. If the selection is expanded, it will be deleted first.

### `insertInline`

`insertInline(inline: Inline) => Change`   
  
`insertInline(properties: Object) => Change`

Insert a new inline at the current cursor position, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertText`

`insertText(text: String) => Change`

Insert a string of `text` at the current selection. If the selection is expanded, it will be deleted first.

### `addMark`

`addMark(mark: Mark) => Change`   
  
`addMark(properties: Object) => Change`   
  
`addMark(type: String) => Change`

Add a [`mark`](mark.md) to the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `setBlocks`

`setBlocks(properties: Object) => Change`   
  
`setBlocks(type: String) => Change`

Set the `properties` of the [`Blocks`](block.md) in the current selection. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlines`

`setInlines(properties: Object) => Change`   
  
`setInlines(type: String) => Change`

Set the `properties` of the [`Inlines`](inline.md) nodes in the current selection. For convenience, you can pass a `type` string to set the inline nodes' type only.

### `splitBlock`

`splitBlock(depth: Number) => Change`

Split the [`Block`](block.md) in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInline`

`splitInline(depth: Number) => Change`

Split the [`Inline`](inline.md) node in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMark`

`removeMark(mark: Mark) => Change`   
  
`removeMark(properties: Object) => Change`   
  
`removeMark(type: String) => Change`

Remove a [`mark`](mark.md) from the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `toggleMark`

`toggleMark(mark: Mark) => Change`   
  
`toggleMark(properties: Object) => Change`   
  
`toggleMark(type: String) => Change`

Add or remove a [`mark`](mark.md) from the characters in the current selection, depending on it already exists on any or not. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `unwrapBlock`

`unwrapBlock(type: String) => Change`   
  
`unwrapBlock(properties: Object) => Change`   


Unwrap all [`Block`](block.md) nodes in the current selection that match a `type` and/or `data`.

### `unwrapInline`

`unwrapInline(type: String) => Change`   
  
`unwrapInline(properties: Object) => Change`   


Unwrap all [`Inline`](inline.md) nodes in the current selection that match a `type` and/or `data`.

### `wrapBlock`

`wrapBlock(type: String) => Change`   
  
`wrapBlock(properties: Object) => Change`   


Wrap the [`Block`](block.md) nodes in the current selection with a new [`Block`](block.md) node of `type`, with optional `data`.

### `wrapInline`

`wrapInline(type: String) => Change`   
  
`wrapInline(properties: Object) => Change`   


Wrap the [`Inline`](inline.md) nodes in the current selection with a new [`Inline`](inline.md) node of `type`, with optional `data`.

### `wrapText`

`wrapText(prefix: String, [suffix: String]) => Change`

Surround the text in the current selection with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Selection Changes

These changes change the current `selection`, without touching the `document`.

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

Collapse the current selection to the `{Edge}` of the next [`Block`](block.md) node in `{Direction}`. Where `{Edge}` is either `Start` or `End` and `{Direction}` is either `Next` or `Previous`.

### `collapseTo{Edge}Of{Direction}Text`

`collapseTo{Edge}Of{Direction}Text() => Change`

Collapse the current selection to the `{Edge}` of the next [`Text`](text.md) node in `{Direction}`. Where `{Edge}` is either `Start` or `End` and `{Direction}` is either `Next` or `Previous`.

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

Move the current selection's offsets by `n`.

### `move{Edge}`

`move{Edge}(n: Number) => Change`

Move the current selection's `{Edge}` offset by `n`. `{Edge}` can be one of `Start`, `End`.

### `moveOffsetsTo`

`moveOffsetsTo(anchorOffset: Number, focusOffset: Number) => Change`

Move the current selection's offsets to a new `anchorOffset` and `focusOffset`.

### `moveToRangeOf`

`moveToRangeOf(node: Node) => Change`

Move the current selection's anchor point to the start of a `node` and its focus point to the end of the `node`.

### `select`

`select(properties: Range || Object) => Change`

Set the current selection to a range with merged `properties`. The `properties` can either be a [`Range`](range.md) object or a plain Javascript object of selection properties.

### `selectAll`

`selectAll() => Change`

Select the entire document and focus the selection.

### `deselect`

`deselect() => Change`

Unset the selection.

## Document Changes

These changes act on a specific [`Range`](range.md) of the document.

### `deleteBackwardAtRange`

`deleteBackwardAtRange(range: Range, n: Number) => Change`

Delete backward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](change.md#delete). `n` defaults to `1`.

### `deleteForwardAtRange`

`deleteForwardAtRange(range: Range, n: Number) => Change`

Delete forward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](change.md#delete). `n` defaults to `1`.

### `deleteAtRange`

`deleteAtRange(range: Range, ) => Change`

Delete everything in a `range`.

### `insertBlockAtRange`

`insertBlockAtRange(range: Range, block: Block) => Change`   
  
`insertBlockAtRange(range: Range, properties: Object) => Change`   
  
`insertBlockAtRange(range: Range, type: String) => Change`

Insert a new block at the same level as the leaf block at a `range`, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragmentAtRange`

`insertFragmentAtRange(range: Range, fragment: Document) => Change`

Insert a [`fragment`](document.md) at a `range`. If the selection is expanded, it will be deleted first.

### `insertInlineAtRange`

`insertInlineAtRange(range: Range, inline: Inline) => Change`   
  
`insertInlineAtRange(range: Range, properties: Object) => Change`

Insert a new inline at a `range`, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertTextAtRange`

`insertTextAtRange(range: Range, text: String) => Change`

Insert a string of `text` at a `range`. If the selection is expanded, it will be deleted first.

### `addMarkAtRange`

`addMarkAtRange(range: Range, mark: Mark) => Change`   
  
`addMarkAtRange(range: Range, properties: Object) => Change`   
  
`addMarkAtRange(range: Range, type: String) => Change`

Add a [`mark`](mark.md) to the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `setBlocksAtRange`

`setBlocksAtRange(range: Range, properties: Object) => Change`   
  
`setBlocks(range: Range, type: String) => Change`

Set the `properties` of the [`Blocks`](block.md) in a `range`. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlinesAtRange`

`setInlinesAtRange(range: Range, properties: Object) => Change`   
  
`setInlines(range: Range, type: String) => Change`

Set the `properties` of the [`Inlines`](inline.md) nodes in a `range`. For convenience, you can pass a `type` string to set the inline nodes' type only.

### `splitBlockAtRange`

`splitBlockAtRange(range: Range, depth: Number) => Change`

Split the [`Block`](block.md) in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInlineAtRange`

`splitInlineAtRange(range: Range, depth: Number) => Change`

Split the [`Inline`](inline.md) node in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMarkAtRange`

`removeMarkAtRange(range: Range, mark: Mark) => Change`   
  
`removeMarkAtRange(range: Range, properties: Object) => Change`   
  
`removeMarkAtRange(range: Range, type: String) => Change`

Remove a [`mark`](mark.md) from the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `toggleMarkAtRange`

`toggleMarkAtRange(range: Range, mark: Mark) => Change`   
  
`toggleMarkAtRange(range: Range, properties: Object) => Change`   
  
`toggleMarkAtRange(range: Range, type: String) => Change`

Add or remove a [`mark`](mark.md) from the characters in a `range`, depending on whether any of them already have the mark. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](mark.md) of that type.

### `unwrapBlockAtRange`

`unwrapBlockAtRange(range: Range, properties: Object) => Change`   
  
`unwrapBlockAtRange(range: Range, type: String) => Change`

Unwrap all [`Block`](block.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapInlineAtRange`

`unwrapInlineAtRange(range: Range, properties: Object) => Change`   
  
`unwrapInlineAtRange(range: Range, type: String) => Change`

Unwrap all [`Inline`](inline.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapBlockAtRange`

`wrapBlockAtRange(range: Range, properties: Object) => Change`   
  
`wrapBlockAtRange(range: Range, type: String) => Change`

Wrap the [`Block`](block.md) nodes in a `range` with a new [`Block`](block.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineAtRange`

`wrapInlineAtRange(range: Range, properties: Object) => Change`   
  
`wrapInlineAtRange(range: Range, type: String) => Change`

Wrap the [`Inline`](inline.md) nodes in a `range` with a new [`Inline`](inline.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapTextAtRange`

`wrapTextAtRange(range: Range, prefix: String, [suffix: String]) => Change`

Surround the text in a `range` with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Node Changes

These changes are lower-level, and act on a specific node by its `key`. They're often used in your custom components because you'll have access to `props.node`.

### `addMarkByKey`

`addMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`

Add a `mark` to `length` characters starting at an `offset` in a [`Node`](node.md) by its `key`.

### `insertNodeByKey`

`insertNodeByKey(key: String, index: Number, node: Node) => Change`

Insert a `node` at `index` inside a parent [`Node`](node.md) by its `key`.

### `insertFragmentByKey`

`insertFragmentByKey(key: String, index: Number, fragment: Fragment) => Transform`

Insert a [`Fragment`](https://github.com/thesunny/slate/tree/28220e7007adc232fa5fefae52c970d7a3531d3d/docs/reference/slate/fragment.md) at `index` inside a parent [`Node`](node.md) by its `key`.

### `insertTextByKey`

`insertTextByKey(key: String, offset: Number, text: String, [marks: Set]) => Change`

Insert `text` at an `offset` in a [`Text Node`](text.md) by its `key` with optional `marks`.

### `moveNodeByKey`

`moveNodeByKey(key: String, newKey: String, newIndex: Number) => Change`

Move a [`Node`](node.md) by its `key` to a new parent node with its `newKey` and at a `newIndex`.

### `removeMarkByKey`

`removeMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`

Remove a `mark` from `length` characters starting at an `offset` in a [`Node`](node.md) by its `key`.

### `removeNodeByKey`

`removeNodeByKey(key: String) => Change`

Remove a [`Node`](node.md) from the document by its `key`.

### `replaceNodeByKey`

`replaceNodeByKey(key: String, node: Node) => Change`

Replace a [`Node`](node.md) in the document with a new [`Node`](node.md) by its `key`.

### `removeTextByKey`

`removeTextByKey(key: String, offset: Number, length: Number) => Change`

Remove `length` characters of text starting at an `offset` in a [`Node`](node.md) by its `key`.

### `setMarkByKey`

`setMarkByKey(key: String, offset: Number, length: Number, mark: Mark, properties: Object) => Change`

Set a dictionary of `properties` on a [`mark`](mark.md) on a [`Node`](node.md) by its `key`.

### `setNodeByKey`

`setNodeByKey(key: String, properties: Object) => Change`   
  
`setNodeByKey(key: String, type: String) => Change`

Set a dictionary of `properties` on a [`Node`](node.md) by its `key`. For convenience, you can pass a `type` string or `properties` object.

### `splitNodeByKey`

`splitNodeByKey(key: String, offset: Number) => Change`

Split a node by its `key` at an `offset`.

### `unwrapInlineByKey`

`unwrapInlineByKey(key: String, properties: Object) => Change`   
  
`unwrapInlineByKey(key: String, type: String) => Change`

Unwrap all inner content of an [`Inline`](inline.md) node by its `key` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapBlockByKey`

`unwrapBlockByKey(key: String, properties: Object) => Change`   
  
`unwrapBlockByKey(key: String, type: String) => Change`

Unwrap all inner content of a [`Block`](block.md) node by its `key` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapNodeByKey`

`unwrapNodeByKey(key: String) => Change`

Unwrap a single node from its parent. If the node is surrounded with siblings, its parent will be split. If the node is the only child, the parent is removed, and simply replaced by the node itself. Cannot unwrap a root node.

### `wrapBlockByKey`

`wrapBlockByKey(key: String, properties: Object) => Change`   
  
`wrapBlockByKey(key: String, type: String) => Change`

Wrap the given node in a [`Block`](block.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineByKey`

`wrapInlineByKey(key: String, properties: Object) => Change`   
  
`wrapInlineByKey(key: String, type: String) => Change`

Wrap the given node in a [`Inline`](inline.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

## History Changes

These changes use the history to undo/redo previously made changes.

### `redo`

`redo() => Change`

Move forward one step in the history.

### `undo`

`undo() => Change`

Move backward one step in the history.

### `snapshotSelection`

`snapshotSelection() => Change`

Snapshot `value.selection` for `undo` purposes, useful with delete operations like `removeNodeByKey(focusBlock.key).undo()`

