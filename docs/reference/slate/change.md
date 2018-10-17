# `Change`

A change allows you to define a series of changes you'd like to make to the current [`Value`](./value.md).

All changes are performed through `Change` objects, so that a history of changes can be preserved for use in undo/redo operations, and to make collaborative editing possible.

## Properties

### `editor`

`Editor`

A reference to the editor the change is being made in.

### `object`

`String`

A string with a value of `'change'`.

### `value`

`Value`

A [`Value`](./value.md) with the change's current operations applied. Each time you run a new change function this property will be updated.

## Methods

### `call`

`call(fn: Function, ...args) => Change`

This method calls the provided function with the current instance of the `Change` object as the first argument and passes through the remaining `args`.

The purpose of `call` is to enable custom change methods to exist and called in a chain. For example:

```js
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

### `normalize`

`normalize() => Void`

This method normalizes the document with the value's schema. This should run automatically-you should not need to call this method unless you have manually disabled normalization (and you should rarely, if ever, need to manually disable normalization). The vast majority of changes, whether by the user or invoked programmatically, will run `normalize` by default to ensure the document is always in adherence to its schema.

> 🤖 If you must use this method, use it sparingly and strategically. Calling this method can be very expensive as it will run normalization on all of the nodes in your document.

### `withoutNormalizing`

`withoutNormalizing(fn: Function) => Change`

This method calls the provided function with the current instance of the `Change` object as the first argument. Normalization does not occur while the fuction is executing, and is instead deferred to be be run immediately after it completes.

This method can be used to allow a sequence of change operations that should not be interrupted by normalization. For example:

```js
function removeManyNodes(node) {
  const toRemove = node.nodes.filter(n => n.object != 'block')
  if (!toRemove.size) return

  change.withoutNormalizing(() => {
    toRemove.forEach(child => {
      change.removeNodeByKey(child.key)
    })
  })
}
```

### `withoutSaving`

`withoutSaving(fn: Function) => Change`

By default all new operations are saved to the editor's history. If you have changes that you don't want to show up in the history when the user presses <kbd>cmd+z</kbd>, you can use `withoutSaving` to skip those changes.

```js
change.withoutSaving(() => {
  change.setValue({ decorations })
})
```

However, be sure you know what you are doing because this will create changes that cannot be undone by the user, and might result in confusing behaviors.

### `withoutMerging`

`withoutMerging(fn: Function) => Change`

Usually, all of the operations in a `Change` are grouped into a single save point in the editor's history. However, sometimes you may want more control over this, to be able to create distinct save points in a single change. To do that, you can use the `withoutMerging` helper.

## Full Value Change

### `setValue`

`setValue(properties: Object, [options: Object]) => Change` <br/>
`setValue(value: Value, [options: Object]) => Change` (see warning below)

Set the entire `value` using either a `properties` object or a `Value` object. Can be used to set `value.data` and other properties that cannot otherwise be easily set using the available methods.

## Current Selection Changes

These changes act on the `document` based on the current `selection`. They are equivalent to calling the [Document Range Changes](#document-range-changes) with the current selection as the `range` argument, but they are there for convenience, since you often want to act with the current selection, as a user would.

### `addMark`

`addMark(mark: Mark) => Change` <br/>
`addMark(properties: Object) => Change` <br/>
`addMark(type: String) => Change`

Add a [`mark`](./mark.md) to the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `delete`

`delete() => Change`

Delete everything in the current selection.

### `insertBlock`

`insertBlock(block: Block) => Change` <br/>
`insertBlock(properties: Object) => Change` <br/>
`insertBlock(type: String) => Change`

### `deleteBackward`

`deleteBackward(n: Number) => Change`

Delete backward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForward`

`deleteForward(n: Number) => Change`

Delete forward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

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

### `setBlocks`

`setBlocks(properties: Object) => Change` <br/>
`setBlocks(type: String) => Change`

Set the `properties` of the [`Blocks`](./block.md) in the current selection. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlines`

`setInlines(properties: Object) => Change` <br/>
`setInlines(type: String) => Change`

Set the `properties` of the [`Inlines`](./inline.md) nodes in the current selection. For convenience, you can pass a `type` string to set the inline nodes' type only.

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

### `replaceMark`

`replaceMark(oldMark: Mark, newMark: Mark) => Change` <br/>
`replaceMark(oldProperties: Object, newProperties: Object) => Change` <br/>
`replaceMark(oldType: String, newType: String) => Change`

Replace a [`mark`](./mark.md) in the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMark`

`toggleMark(mark: Mark) => Change` <br/>
`toggleMark(properties: Object) => Change` <br/>
`toggleMark(type: String) => Change`

Add or remove a [`mark`](./mark.md) from the characters in the current selection, depending on it already exists on any or not. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlock`

`unwrapBlock(type: String) => Change` <br/>
`unwrapBlock(properties: Object) => Change` <br />

Unwrap all [`Block`](./block.md) nodes in the current selection that match a `type` and/or `data`.

### `unwrapInline`

`unwrapInline(type: String) => Change` <br/>
`unwrapInline(properties: Object) => Change` <br/>

Unwrap all [`Inline`](./inline.md) nodes in the current selection that match a `type` and/or `data`.

### `wrapBlock`

`wrapBlock(type: String) => Change` <br/>
`wrapBlock(properties: Object) => Change` <br/>

Wrap the [`Block`](./block.md) nodes in the current selection with a new [`Block`](./block.md) node of `type`, with optional `data`.

### `wrapInline`

`wrapInline(type: String) => Change` <br />
`wrapInline(properties: Object) => Change` <br />

Wrap the [`Inline`](./inline.md) nodes in the current selection with a new [`Inline`](./inline.md) node of `type`, with optional `data`.

### `wrapText`

`wrapText(prefix: String, [suffix: String]) => Change`

Surround the text in the current selection with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Selection Changes

These changes change the current `selection`, without touching the `document`.

### `blur`

`blur() => Change`

Blur the current selection.

### `deselect`

`deselect() => Change`

Unset the selection.

### `flip`

`flip() => Change`

Flip the selection.

### `focus`

`focus() => Change`

Focus the current selection.

### `move{Point}Backward`

`move{Point}Backward(n: Number) => Change`

Move the `{Point}` of the selection backward `n` characters. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}Forward`

`move{Point}Forward(n: Number) => Change`

Move the `{Point}` of the selection forward `n` characters. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To`

`moveTo(path: List, offset: Number) => Change`
`moveTo(key: String, offset: Number) => Change`
`moveTo(offset: Number) => Change`

Move the `{Point}` of the selection to a new `path` or `key` and `offset`. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `moveTo{Point}`

`moveTo{Point}() => Change`

Collapse the current selection to one of its points. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`.

### `move{Point}To{Edge}OfBlock`

`move{Point}To{Edge}OfBlock() => Change`

Move the current selection to the `{Edge}` of the closest block parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfDocument`

`move{Point}To{Edge}OfDocument() => Change`

Move the current selection to the `{Edge}` of the document. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfInline`

`move{Point}To{Edge}OfInline() => Change`

Move the current selection to the `{Edge}` of the closest inline parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfNode`

`move{Point}To{Edge}OfNode(node: Node) => Change`

Move the current selection to the `{Edge}` of a `node`. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfText`

`move{Point}To{Edge}OfText() => Change`

Move the current selection to the `{Edge}` of the current text node. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Block`

`move{Point}To{Edge}Of{Direction}Block() => Change`

Move the current selection to the `{Edge}` of the closest block parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Inline`

`move{Point}To{Edge}Of{Direction}Inline() => Change`

Move the current selection to the `{Edge}` of the closest inline parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Text`

`move{Point}To{Edge}Of{Direction}Text() => Change`

Move the current selection to the `{Edge}` of the current text node. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `moveToRangeOf`

`moveToRangeOf(node: Node) => Change`

Move the current selection's anchor point to the start of a `node` and its focus point to the end of the `node`.

### `moveToRangeOfDocument`

`moveToRangeOf() => Change`

Move the current selection's anchor point to the start of the document and its focus point to the end of the document, selecting everything.

### `select`

`select(properties: Range || Object) => Change`

Set the current selection to a range with merged `properties`. The `properties` can either be a [`Range`](./range.md) object or a plain JavaScript object of selection properties.

## Document Range Changes

These changes act on a specific [`Range`](./range.md) of the document.

### `addMarkAtRange`

`addMarkAtRange(range: Range, mark: Mark) => Change` <br/>
`addMarkAtRange(range: Range, properties: Object) => Change` <br/>
`addMarkAtRange(range: Range, type: String) => Change`

Add a [`mark`](./mark.md) to the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `deleteAtRange`

`deleteAtRange(range: Range, ) => Change`

Delete everything in a `range`.

### `deleteBackwardAtRange`

`deleteBackwardAtRange(range: Range, n: Number) => Change`

Delete backward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForwardAtRange`

`deleteForwardAtRange(range: Range, n: Number) => Change`

Delete forward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `insertBlockAtRange`

`insertBlockAtRange(range: Range, block: Block) => Change` <br/>
`insertBlockAtRange(range: Range, properties: Object) => Change` <br/>
`insertBlockAtRange(range: Range, type: String) => Change`

Insert a new block at the same level as the leaf block at a `range`, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragmentAtRange`

`insertFragmentAtRange(range: Range, fragment: Document) => Change`

Insert a [`fragment`](./document.md) at a `range`. If the selection is expanded, it will be deleted first.

### `insertInlineAtRange`

`insertInlineAtRange(range: Range, inline: Inline) => Change` <br/>
`insertInlineAtRange(range: Range, properties: Object) => Change`

Insert a new inline at a `range`, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertTextAtRange`

`insertTextAtRange(range: Range, text: String) => Change`

Insert a string of `text` at a `range`. If the selection is expanded, it will be deleted first.

### `setBlocksAtRange`

`setBlocksAtRange(range: Range, properties: Object) => Change` <br/>
`setBlocks(range: Range, type: String) => Change`

Set the `properties` of the [`Blocks`](./block.md) in a `range`. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlinesAtRange`

`setInlinesAtRange(range: Range, properties: Object) => Change` <br/>
`setInlines(range: Range, type: String) => Change`

Set the `properties` of the [`Inlines`](./inline.md) nodes in a `range`. For convenience, you can pass a `type` string to set the inline nodes' type only.

### `splitBlockAtRange`

`splitBlockAtRange(range: Range, depth: Number) => Change`

Split the [`Block`](./block.md) in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInlineAtRange`

`splitInlineAtRange(range: Range, depth: Number) => Change`

Split the [`Inline`](./inline.md) node in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMarkAtRange`

`removeMarkAtRange(range: Range, mark: Mark) => Change` <br/>
`removeMarkAtRange(range: Range, properties: Object) => Change` <br/>
`removeMarkAtRange(range: Range, type: String) => Change`

Remove a [`mark`](./mark.md) from the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMarkAtRange`

`toggleMarkAtRange(range: Range, mark: Mark) => Change` <br/>
`toggleMarkAtRange(range: Range, properties: Object) => Change` <br/>
`toggleMarkAtRange(range: Range, type: String) => Change`

Add or remove a [`mark`](./mark.md) from the characters in a `range`, depending on whether any of them already have the mark. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlockAtRange`

`unwrapBlockAtRange(range: Range, properties: Object) => Change` <br/>
`unwrapBlockAtRange(range: Range, type: String) => Change`

Unwrap all [`Block`](./block.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapInlineAtRange`

`unwrapInlineAtRange(range: Range, properties: Object) => Change` <br/>
`unwrapInlineAtRange(range: Range, type: String) => Change`

Unwrap all [`Inline`](./inline.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapBlockAtRange`

`wrapBlockAtRange(range: Range, properties: Object) => Change` <br/>
`wrapBlockAtRange(range: Range, type: String) => Change`

Wrap the [`Block`](./block.md) nodes in a `range` with a new [`Block`](./block.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineAtRange`

`wrapInlineAtRange(range: Range, properties: Object) => Change` <br/>
`wrapInlineAtRange(range: Range, type: String) => Change`

Wrap the [`Inline`](./inline.md) nodes in a `range` with a new [`Inline`](./inline.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapTextAtRange`

`wrapTextAtRange(range: Range, prefix: String, [suffix: String]) => Change`

Surround the text in a `range` with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Node Changes

These changes are lower-level, and act on a specific node by its `key` or `path`. They're often used in your custom components because you'll have access to `props.node`.

### `addMarkByKey/Path`

`addMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`
`addMarkByPath(path: List, offset: Number, length: Number, mark: Mark) => Change`

Add a `mark` to `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `insertNodeByKey/Path`

`insertNodeByKey(key: String, index: Number, node: Node) => Change`
`insertNodeByPath(path: List, index: Number, node: Node) => Change`

Insert a `node` at `index` inside a parent [`Node`](./node.md) by its `key` or `path`.

### `insertFragmentByKey/Path`

`insertFragmentByKey(key: String, index: Number, fragment: Fragment) => Transform`
`insertFragmentByPath(path: list, index: Number, fragment: Fragment) => Transform`

Insert a [`Fragment`](./fragment.md) at `index` inside a parent [`Node`](./node.md) by its `key` or `path`.

### `insertTextByKey/Path`

`insertTextByKey(key: String, offset: Number, text: String, [marks: Set]) => Change`
`insertTextByPath(path: List, offset: Number, text: String, [marks: Set]) => Change`

Insert `text` at an `offset` in a [`Text Node`](./text.md) by its `key` with optional `marks`.

### `mergeNodeByKey/Path`

`mergeNodeByKey(key: String) => Change`
`mergeNodeByPath(path: List) => Change`

Merge a [`Node`](./node.md) by its `key` or `path` with its previous sibling.

### `moveNodeByKey/Path`

`moveNodeByKey(key: String, newKey: String, newIndex: Number) => Change`
`moveNodeByPath(path: List, newKey: String, newIndex: Number) => Change`

Move a [`Node`](./node.md) by its `key` or `path` to a new parent node with its `newKey` and at a `newIndex`.

### `removeMarkByKey/Path`

`removeMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Change`
`removeMarkByPath(path: List, offset: Number, length: Number, mark: Mark) => Change`

Remove a `mark` from `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `removeNodeByKey/Path`

`removeNodeByKey(key: String) => Change`
`removeNodeByPath(path: List) => Change`

Remove a [`Node`](./node.md) from the document by its `key` or `path`.

### `replaceNodeByKey/Path`

`replaceNodeByKey(key: String, node: Node) => Change`
`replaceNodeByPath(path: List, node: Node) => Change`

Replace a [`Node`](./node.md) in the document with a new [`Node`](./node.md) by its `key` or `path`.

### `removeTextByKey/Path`

`removeTextByKey(key: String, offset: Number, length: Number) => Change`
`removeTextByPath(path: List, offset: Number, length: Number) => Change`

Remove `length` characters of text starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `setMarkByKey/Path`

`setMarkByKey(key: String, offset: Number, length: Number, mark: Mark, properties: Object) => Change`
`setMarkByPath(path: List, offset: Number, length: Number, mark: Mark, properties: Object) => Change`

Set a dictionary of `properties` on a [`mark`](./mark.md) on a [`Node`](./node.md) by its `key` or `path`.

### `setNodeByKey/Path`

`setNodeByKey(key: String, properties: Object) => Change` <br/>
`setNodeByKey(key: String, type: String) => Change`
`setNodeByPath(path: List, properties: Object) => Change` <br/>
`setNodeByPath(path: List, type: String) => Change`

Set a dictionary of `properties` on a [`Node`](./node.md) by its `key` or `path`. For convenience, you can pass a `type` string or `properties` object.

### `splitNodeByKey/Path`

`splitNodeByKey(key: String, offset: Number) => Change`
`splitNodeByPath(path: List, offset: Number) => Change`

Split a node by its `key` or `path` at an `offset`.

### `unwrapInlineByKey/Path`

`unwrapInlineByKey(key: String, properties: Object) => Change` <br/>
`unwrapInlineByKey(key: String, type: String) => Change`
`unwrapInlineByPath(path: List, properties: Object) => Change` <br/>
`unwrapInlineByPath(path: List, type: String) => Change`

Unwrap all inner content of an [`Inline`](./inline.md) node by its `key` or `path` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapBlockByKey/Path`

`unwrapBlockByKey(key: String, properties: Object) => Change` <br/>
`unwrapBlockByKey(key: String, type: String) => Change`
`unwrapBlockByPath(path: List, properties: Object) => Change` <br/>
`unwrapBlockByPath(path: List, type: String) => Change`

Unwrap all inner content of a [`Block`](./block.md) node by its `key` or `path` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapNodeByKey/Path`

`unwrapNodeByKey(key: String) => Change`
`unwrapNodeByPath(path: List) => Change`

Unwrap a single node from its parent. If the node is surrounded with siblings, its parent will be split. If the node is the only child, the parent is removed, and simply replaced by the node itself. Cannot unwrap a root node.

### `wrapBlockByKey/Path`

`wrapBlockByKey(key: String, properties: Object) => Change` <br/>
`wrapBlockByKey(key: String, type: String) => Change`
`wrapBlockByPath(path: List, properties: Object) => Change` <br/>
`wrapBlockByPath(path: List, type: String) => Change`

Wrap the given node in a [`Block`](./block.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineByKey/Path`

`wrapInlineByKey(key: String, properties: Object) => Change` <br/>
`wrapInlineByKey(key: String, type: String) => Change`
`wrapInlineByPath(path: List, properties: Object) => Change` <br/>
`wrapInlineByPath(path: List, type: String) => Change`

Wrap the given node in a [`Inline`](./inline.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapNodeByKey/Path`

`wraNodeByKey(key: String, parent: Node) => Change` <br/>
`wraNodeByPath(path: List, parent: Node) => Change` <br/>

Wrap the node with the specified key with the parent [`Node`](./node.md). This will clear all children of the parent.

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

Snapshot `value.selection` for `undo` purposes, useful with delete operations like `change.removeNodeByKey(focusBlock.key).undo()`.
