# Commands

The core `Editor` ships with a bunch of built-in commands that provide common behaviors for rich text editors.

## Current Selection Commands

These commands act on the `document` based on the current `selection`. They are equivalent to calling the [Document Range Commands](#document-range-commands) with the current selection as the `range` argument, but they are there for convenience, since you often want to act with the current selection, as a user would.

### `addMark`

`addMark(mark: Mark) => Editor` <br/>
`addMark(properties: Object) => Editor` <br/>
`addMark(type: String) => Editor`

Add a [`mark`](./mark.md) to the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `delete`

`delete() => Editor`

Delete everything in the current selection.

### `insertBlock`

`insertBlock(block: Block) => Editor` <br/>
`insertBlock(properties: Object) => Editor` <br/>
`insertBlock(type: String) => Editor`

### `deleteBackward`

`deleteBackward(n: Number) => Editor`

Delete backward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForward`

`deleteForward(n: Number) => Editor`

Delete forward `n` characters at the current cursor. If the selection is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

Insert a new block at the same level as the current block, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragment`

`insertFragment(fragment: Document) => Editor`

Insert a [`fragment`](./document.md) at the current selection. If the selection is expanded, it will be deleted first.

### `insertInline`

`insertInline(inline: Inline) => Editor` <br/>
`insertInline(properties: Object) => Editor`

Insert a new inline at the current cursor position, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertText`

`insertText(text: String) => Editor`

Insert a string of `text` at the current selection. If the selection is expanded, it will be deleted first.

### `setBlocks`

`setBlocks(properties: Object) => Editor` <br/>
`setBlocks(type: String) => Editor`

Set the `properties` of the [`Blocks`](./block.md) in the current selection. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlines`

`setInlines(properties: Object) => Editor` <br/>
`setInlines(type: String) => Editor`

Set the `properties` of the [`Inlines`](./inline.md) nodes in the current selection. For convenience, you can pass a `type` string to set the inline nodes' type only.

### `splitBlock`

`splitBlock(depth: Number) => Editor`

Split the [`Block`](./block.md) in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInline`

`splitInline(depth: Number) => Editor`

Split the [`Inline`](./inline.md) node in the current selection by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMark`

`removeMark(mark: Mark) => Editor` <br/>
`removeMark(properties: Object) => Editor` <br/>
`removeMark(type: String) => Editor`

Remove a [`mark`](./mark.md) from the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `replaceMark`

`replaceMark(oldMark: Mark, newMark: Mark) => Editor` <br/>
`replaceMark(oldProperties: Object, newProperties: Object) => Editor` <br/>
`replaceMark(oldType: String, newType: String) => Editor`

Replace a [`mark`](./mark.md) in the characters in the current selection. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMark`

`toggleMark(mark: Mark) => Editor` <br/>
`toggleMark(properties: Object) => Editor` <br/>
`toggleMark(type: String) => Editor`

Add or remove a [`mark`](./mark.md) from the characters in the current selection, depending on it already exists on any or not. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlock`

`unwrapBlock(type: String) => Editor` <br/>
`unwrapBlock(properties: Object) => Editor` <br />

Unwrap all [`Block`](./block.md) nodes in the current selection that match a `type` and/or `data`.

### `unwrapInline`

`unwrapInline(type: String) => Editor` <br/>
`unwrapInline(properties: Object) => Editor` <br/>

Unwrap all [`Inline`](./inline.md) nodes in the current selection that match a `type` and/or `data`.

### `wrapBlock`

`wrapBlock(type: String) => Editor` <br/>
`wrapBlock(properties: Object) => Editor` <br/>

Wrap the [`Block`](./block.md) nodes in the current selection with a new [`Block`](./block.md) node of `type`, with optional `data`.

### `wrapInline`

`wrapInline(type: String) => Editor` <br />
`wrapInline(properties: Object) => Editor` <br />

Wrap the [`Inline`](./inline.md) nodes in the current selection with a new [`Inline`](./inline.md) node of `type`, with optional `data`.

### `wrapText`

`wrapText(prefix: String, [suffix: String]) => Editor`

Surround the text in the current selection with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Selection Commands

These commands change the current `selection`, without touching the `document`.

### `blur`

`blur() => Editor`

Blur the current selection.

### `deselect`

`deselect() => Editor`

Unset the selection.

### `flip`

`flip() => Editor`

Flip the selection.

### `focus`

`focus() => Editor`

Focus the current selection.

### `move{Point}Backward`

`move{Point}Backward(n: Number) => Editor`

Move the `{Point}` of the selection backward `n` characters. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}Forward`

`move{Point}Forward(n: Number) => Editor`

Move the `{Point}` of the selection forward `n` characters. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To`

`moveTo(path: List, offset: Number) => Editor`
`moveTo(key: String, offset: Number) => Editor`
`moveTo(offset: Number) => Editor`

Move the `{Point}` of the selection to a new `path` or `key` and `offset`. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `moveTo{Point}`

`moveTo{Point}() => Editor`

Collapse the current selection to one of its points. Where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`.

### `move{Point}To{Edge}OfBlock`

`move{Point}To{Edge}OfBlock() => Editor`

Move the current selection to the `{Edge}` of the closest block parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfDocument`

`move{Point}To{Edge}OfDocument() => Editor`

Move the current selection to the `{Edge}` of the document. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfInline`

`move{Point}To{Edge}OfInline() => Editor`

Move the current selection to the `{Edge}` of the closest inline parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfNode`

`move{Point}To{Edge}OfNode(node: Node) => Editor`

Move the current selection to the `{Edge}` of a `node`. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}OfText`

`move{Point}To{Edge}OfText() => Editor`

Move the current selection to the `{Edge}` of the current text node. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Block`

`move{Point}To{Edge}Of{Direction}Block() => Editor`

Move the current selection to the `{Edge}` of the closest block parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Inline`

`move{Point}To{Edge}Of{Direction}Inline() => Editor`

Move the current selection to the `{Edge}` of the closest inline parent. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `move{Point}To{Edge}Of{Direction}Text`

`move{Point}To{Edge}Of{Direction}Text() => Editor`

Move the current selection to the `{Edge}` of the current text node. Where `{Edge}` is either `Start` or `End`. And where `{Point}` is either `Anchor`, `Focus`, `Start` or `End`. You can also omit `{Point}` to move both the anchor and focus points at the same time.

### `moveToRangeOf`

`moveToRangeOf(node: Node) => Editor`

Move the current selection's anchor point to the start of a `node` and its focus point to the end of the `node`.

### `moveToRangeOfDocument`

`moveToRangeOfDocument() => Editor`

Move the current selection's anchor point to the start of the document and its focus point to the end of the document, selecting everything.

### `select`

`select(properties: Range || Object) => Editor`

Set the current selection to a range with merged `properties`. The `properties` can either be a [`Range`](./range.md) object or a plain JavaScript object of selection properties.

## Document Range Commands

These commands act on a specific [`Range`](./range.md) of the document.

### `addMarkAtRange`

`addMarkAtRange(range: Range, mark: Mark) => Editor` <br/>
`addMarkAtRange(range: Range, properties: Object) => Editor` <br/>
`addMarkAtRange(range: Range, type: String) => Editor`

Add a [`mark`](./mark.md) to the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `deleteAtRange`

`deleteAtRange(range: Range, ) => Editor`

Delete everything in a `range`.

### `deleteBackwardAtRange`

`deleteBackwardAtRange(range: Range, n: Number) => Editor`

Delete backward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `deleteForwardAtRange`

`deleteForwardAtRange(range: Range, n: Number) => Editor`

Delete forward `n` characters at a `range`. If the `range` is expanded, this method is equivalent to a regular [`delete()`](#delete). `n` defaults to `1`.

### `insertBlockAtRange`

`insertBlockAtRange(range: Range, block: Block) => Editor` <br/>
`insertBlockAtRange(range: Range, properties: Object) => Editor` <br/>
`insertBlockAtRange(range: Range, type: String) => Editor`

Insert a new block at the same level as the leaf block at a `range`, splitting the current block to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertFragmentAtRange`

`insertFragmentAtRange(range: Range, fragment: Document) => Editor`

Insert a [`fragment`](./document.md) at a `range`. If the selection is expanded, it will be deleted first.

### `insertInlineAtRange`

`insertInlineAtRange(range: Range, inline: Inline) => Editor` <br/>
`insertInlineAtRange(range: Range, properties: Object) => Editor`

Insert a new inline at a `range`, splitting the text to make room if it is non-empty. If the selection is expanded, it will be deleted first.

### `insertTextAtRange`

`insertTextAtRange(range: Range, text: String) => Editor`

Insert a string of `text` at a `range`. If the selection is expanded, it will be deleted first.

### `setBlocksAtRange`

`setBlocksAtRange(range: Range, properties: Object) => Editor` <br/>
`setBlocks(range: Range, type: String) => Editor`

Set the `properties` of the [`Blocks`](./block.md) in a `range`. For convenience, you can pass a `type` string to set the blocks' type only.

### `setInlinesAtRange`

`setInlinesAtRange(range: Range, properties: Object) => Editor` <br/>
`setInlines(range: Range, type: String) => Editor`

Set the `properties` of the [`Inlines`](./inline.md) nodes in a `range`. For convenience, you can pass a `type` string to set the inline nodes' type only.

### `splitBlockAtRange`

`splitBlockAtRange(range: Range, depth: Number) => Editor`

Split the [`Block`](./block.md) in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `1`.

### `splitInlineAtRange`

`splitInlineAtRange(range: Range, depth: Number) => Editor`

Split the [`Inline`](./inline.md) node in a `range` by `depth` levels. If the selection is expanded, it will be deleted first. `depth` defaults to `Infinity`.

### `removeMarkAtRange`

`removeMarkAtRange(range: Range, mark: Mark) => Editor` <br/>
`removeMarkAtRange(range: Range, properties: Object) => Editor` <br/>
`removeMarkAtRange(range: Range, type: String) => Editor`

Remove a [`mark`](./mark.md) from the characters in a `range`. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `toggleMarkAtRange`

`toggleMarkAtRange(range: Range, mark: Mark) => Editor` <br/>
`toggleMarkAtRange(range: Range, properties: Object) => Editor` <br/>
`toggleMarkAtRange(range: Range, type: String) => Editor`

Add or remove a [`mark`](./mark.md) from the characters in a `range`, depending on whether any of them already have the mark. For convenience, you can pass a `type` string or `properties` object to implicitly create a [`Mark`](./mark.md) of that type.

### `unwrapBlockAtRange`

`unwrapBlockAtRange(range: Range, properties: Object) => Editor` <br/>
`unwrapBlockAtRange(range: Range, type: String) => Editor`

Unwrap all [`Block`](./block.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapInlineAtRange`

`unwrapInlineAtRange(range: Range, properties: Object) => Editor` <br/>
`unwrapInlineAtRange(range: Range, type: String) => Editor`

Unwrap all [`Inline`](./inline.md) nodes in a `range` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapBlockAtRange`

`wrapBlockAtRange(range: Range, properties: Object) => Editor` <br/>
`wrapBlockAtRange(range: Range, type: String) => Editor`

Wrap the [`Block`](./block.md) nodes in a `range` with a new [`Block`](./block.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineAtRange`

`wrapInlineAtRange(range: Range, properties: Object) => Editor` <br/>
`wrapInlineAtRange(range: Range, type: String) => Editor`

Wrap the [`Inline`](./inline.md) nodes in a `range` with a new [`Inline`](./inline.md) node with `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapTextAtRange`

`wrapTextAtRange(range: Range, prefix: String, [suffix: String]) => Editor`

Surround the text in a `range` with `prefix` and `suffix` strings. If the `suffix` is ommitted, the `prefix` will be used instead.

## Node Commands

These commands are lower-level, and act on a specific node by its `key` or `path`. They're often used in your custom components because you'll have access to `props.node`.

### `addMarkByKey/Path`

`addMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Editor`
`addMarkByPath(path: List, offset: Number, length: Number, mark: Mark) => Editor`

Add a `mark` to `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `insertNodeByKey/Path`

`insertNodeByKey(key: String, index: Number, node: Node) => Editor`
`insertNodeByPath(path: List, index: Number, node: Node) => Editor`

Insert a `node` at `index` inside a parent [`Node`](./node.md) by its `key` or `path`.

### `insertFragmentByKey/Path`

`insertFragmentByKey(key: String, index: Number, fragment: Fragment) => Transform`
`insertFragmentByPath(path: list, index: Number, fragment: Fragment) => Transform`

Insert a [`Fragment`](./fragment.md) at `index` inside a parent [`Node`](./node.md) by its `key` or `path`.

### `insertTextByKey/Path`

`insertTextByKey(key: String, offset: Number, text: String, [marks: Set]) => Editor`
`insertTextByPath(path: List, offset: Number, text: String, [marks: Set]) => Editor`

Insert `text` at an `offset` in a [`Text Node`](./text.md) by its `key` with optional `marks`.

### `mergeNodeByKey/Path`

`mergeNodeByKey(key: String) => Editor`
`mergeNodeByPath(path: List) => Editor`

Merge a [`Node`](./node.md) by its `key` or `path` with its previous sibling.

### `moveNodeByKey/Path`

`moveNodeByKey(key: String, newKey: String, newIndex: Number) => Editor`
`moveNodeByPath(path: List, newKey: String, newIndex: Number) => Editor`

Move a [`Node`](./node.md) by its `key` or `path` to a new parent node with its `newKey` and at a `newIndex`.

### `removeMarkByKey/Path`

`removeMarkByKey(key: String, offset: Number, length: Number, mark: Mark) => Editor`
`removeMarkByPath(path: List, offset: Number, length: Number, mark: Mark) => Editor`

Remove a `mark` from `length` characters starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `removeNodeByKey/Path`

`removeNodeByKey(key: String) => Editor`
`removeNodeByPath(path: List) => Editor`

Remove a [`Node`](./node.md) from the document by its `key` or `path`.

### `replaceNodeByKey/Path`

`replaceNodeByKey(key: String, node: Node) => Editor`
`replaceNodeByPath(path: List, node: Node) => Editor`

Replace a [`Node`](./node.md) in the document with a new [`Node`](./node.md) by its `key` or `path`.

### `removeTextByKey/Path`

`removeTextByKey(key: String, offset: Number, length: Number) => Editor`
`removeTextByPath(path: List, offset: Number, length: Number) => Editor`

Remove `length` characters of text starting at an `offset` in a [`Node`](./node.md) by its `key` or `path`.

### `setMarkByKey/Path`

`setMarkByKey(key: String, offset: Number, length: Number, mark: Mark, properties: Object) => Editor`
`setMarkByPath(path: List, offset: Number, length: Number, mark: Mark, properties: Object) => Editor`

Set a dictionary of `properties` on a [`mark`](./mark.md) on a [`Node`](./node.md) by its `key` or `path`.

### `setNodeByKey/Path`

`setNodeByKey(key: String, properties: Object) => Editor` <br/>
`setNodeByKey(key: String, type: String) => Editor`
`setNodeByPath(path: List, properties: Object) => Editor` <br/>
`setNodeByPath(path: List, type: String) => Editor`

Set a dictionary of `properties` on a [`Node`](./node.md) by its `key` or `path`. For convenience, you can pass a `type` string or `properties` object.

### `splitNodeByKey/Path`

`splitNodeByKey(key: String, offset: Number) => Editor`
`splitNodeByPath(path: List, offset: Number) => Editor`

Split a node by its `key` or `path` at an `offset`.

### `unwrapInlineByKey/Path`

`unwrapInlineByKey(key: String, properties: Object) => Editor` <br/>
`unwrapInlineByKey(key: String, type: String) => Editor`
`unwrapInlineByPath(path: List, properties: Object) => Editor` <br/>
`unwrapInlineByPath(path: List, type: String) => Editor`

Unwrap all inner content of an [`Inline`](./inline.md) node by its `key` or `path` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapBlockByKey/Path`

`unwrapBlockByKey(key: String, properties: Object) => Editor` <br/>
`unwrapBlockByKey(key: String, type: String) => Editor`
`unwrapBlockByPath(path: List, properties: Object) => Editor` <br/>
`unwrapBlockByPath(path: List, type: String) => Editor`

Unwrap all inner content of a [`Block`](./block.md) node by its `key` or `path` that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `unwrapNodeByKey/Path`

`unwrapNodeByKey(key: String) => Editor`
`unwrapNodeByPath(path: List) => Editor`

Unwrap a single node from its parent. If the node is surrounded with siblings, its parent will be split. If the node is the only child, the parent is removed, and simply replaced by the node itself. Cannot unwrap a root node.

### `wrapBlockByKey/Path`

`wrapBlockByKey(key: String, properties: Object) => Editor` <br/>
`wrapBlockByKey(key: String, type: String) => Editor`
`wrapBlockByPath(path: List, properties: Object) => Editor` <br/>
`wrapBlockByPath(path: List, type: String) => Editor`

Wrap the given node in a [`Block`](./block.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapInlineByKey/Path`

`wrapInlineByKey(key: String, properties: Object) => Editor` <br/>
`wrapInlineByKey(key: String, type: String) => Editor`
`wrapInlineByPath(path: List, properties: Object) => Editor` <br/>
`wrapInlineByPath(path: List, type: String) => Editor`

Wrap the given node in a [`Inline`](./inline.md) node that match `properties`. For convenience, you can pass a `type` string or `properties` object.

### `wrapNodeByKey/Path`

`wraNodeByKey(key: String, parent: Node) => Editor` <br/>
`wraNodeByPath(path: List, parent: Node) => Editor` <br/>

Wrap the node with the specified key with the parent [`Node`](./node.md). This will clear all children of the parent.

## History Commands

These commands use the history to undo/redo previously made changes.

### `redo`

`redo() => Editor`

Move forward one step in the history.

### `undo`

`undo() => Editor`

Move backward one step in the history.

### `snapshotSelection`

`snapshotSelection() => Editor`

Snapshot `value.selection` for `undo` purposes, useful with delete operations like `change.removeNodeByKey(focusBlock.key).undo()`.

## Miscellaneous Commands

### `normalize`

`normalize() => Editor`

This method normalizes the document with the value's schema. This should run automatically-you should not need to call this method unless you have manually disabled normalization (and you should rarely, if ever, need to manually disable normalization). The vast majority of changes, whether by the user or invoked programmatically, will run `normalize` by default to ensure the document is always in adherence to its schema.

> 🤖 If you must use this method, use it sparingly and strategically. Calling this method can be very expensive as it will run normalization on all of the nodes in your document.

### `withoutNormalizing`

`withoutNormalizing(fn: Function) => Editor`

This method calls the provided function with the current instance of the `Change` object as the first argument. Normalization does not occur while the fuction is executing, and is instead deferred to be be run immediately after it completes.

This method can be used to allow a sequence of change operations that should not be interrupted by normalization. For example:

```js
editor.withoutNormalizing(() => {
  node.nodes.filter(n => n.object != 'block').forEach(child => {
    editor.removeNodeByKey(child.key)
  })
})
```

### `withoutSaving`

`withoutSaving(fn: Function) => Editor`

By default all new operations are saved to the editor's history. If you have changes that you don't want to show up in the history when the user presses <kbd>cmd+z</kbd>, you can use `withoutSaving` to skip those changes.

```js
change.withoutSaving(() => {
  change.setDecorations(decorations)
})
```

However, be sure you know what you are doing because this will create changes that cannot be undone by the user, and might result in confusing behaviors.

### `withoutMerging`

`withoutMerging(fn: Function) => Editor`

Usually, all of the operations in a `Change` are grouped into a single save point in the editor's history. However, sometimes you may want more control over this, to be able to create distinct save points in a single change. To do that, you can use the `withoutMerging` helper.
