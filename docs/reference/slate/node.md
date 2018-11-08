# `Node`

`Node` is not a publicly accessible module, but instead an interface that [`Document`](./document.md), [`Block`](./block.md) and [`Inline`](./inline.md) all implement.

## Properties

### `key`

`String`

A short-lived, unique identifier for the node.

By default, keys are **not** meant to be long-lived unique identifiers for nodes that you might store in a database, or elsewhere. They are meant purely to identify a node inside of a single Slate instance. For that reason, they are simply auto-incrementing strings. (eg. `'0'`, `'1'`, `'2'`, ...)

If you want to make your keys uniqueness long-lived, you'll need to supply your own key generating function via the [`setKeyGenerator`](./utils.md#setkeygenerator) util.

### `nodes`

`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `object`

`String`

An immutable string value of `'document'`, `'block'`, `'inline'` or `'text'` for easily separating this node from [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.

## Methods

### `filterDescendants`

`filterDescendants(iterator: Function) => List`

Deeply filter the descendant nodes of a node by `iterator`.

### `findDescendant`

`findDescendant(iterator: Function) => Node|Void`

Deeply find a descendant node by `iterator`.

### `getAncestors`

`getAncestors(path: List|Array) => List|Void`
`getAncestors(key: String) => List|Void`

Get the ancestors of a descendant by `path` or `key`.

### `getBlocks`

`getBlocks() => List`

Get all of the bottom-most [`Block`](./block.md) node descendants.

### `getLeafBlocksAtRange`

`getLeafBlocksAtRange(range: Range) => List`

Get all of the bottom-most [`Block`](./block.md) nodes in a `range`.

### `getBlocksByType`

`getBlocksByType(type: String) => List`

Get all of the bottom-most [`Block`](./block.md) nodes by `type`.

### `getChild`

`getChild(path: List|Array) => Node|Void`
`getChild(key: String) => Node|Void`

Get a child by `path` or `key`.

### `getClosest`

`getClosest(path: List|Array, match: Function) => Node|Void`
`getClosest(key: String, match: Function) => Node|Void`

Get the closest parent node of a descendant node by `path` or `key` that matches a `match` function.

### `getClosestBlock`

`getClosestBlock(path: List|Array) => Node|Void`
`getClosestBlock(key: String) => Node|Void`

Get the closest [`Block`](./block.md) node to a descendant node by `path` or `key`.

### `getClosestInline`

`getClosestInline(path: List|Array) => Node|Void`
`getClosestInline(key: String) => Node|Void`

Get the closest [`Inline`](./inline.md) node to a descendant node by `path` or `key`.

### `getClosestVoid`

`getClosestVoid(path: List|Array) => Node|Void`
`getClosestVoid(key: String) => Node|Void`

Get the closest void parent of a descendant node by `path` or `key`.

### `getCommonAncestor`

`getCommonAncestor(path: List|Array) => Number`
`getCommonAncestor(key: String) => Number`

Get the lowest common ancestor of a descendant node by `path` or `key`.

### `getDepth`

`getDepth(path: List|Array) => Number`
`getDepth(key: String) => Number`

Get the depth of a descendant node by `path` or `key`.

### `getDescendant`

`getDescendant(path: List|Array) => Node|Void`
`getDescendant(key: String) => Node|Void`

Get a descendant node by `path` or `key`.

### `getFirstText`

`getFirstText() => Text|Void`

Get the first child text node inside a node.

### `getFragmentAtRange`

`getFragmentAtRange(range: Range) => Document`

Get a document fragment of the nodes in a `range`.

### `getFurthest`

`getFurthest(path: List|Array, iterator: Function) => Node|Null`
`getFurthest(key: String, iterator: Function) => Node|Null`

Get the furthest parent of a node by `path` or `key` that matches an `iterator`.

### `getFurthestAncestor`

`getFurthestAncestor(path: List|Array) => Node|Null`
`getFurthestAncestor(key: String) => Node|Null`

Get the furthest ancestor of a node by `path` or `key`.

### `getFurthestBlock`

`getFurthestBlock(path: List|Array) => Node|Null`
`getFurthestBlock(key: String) => Node|Null`

Get the furthest block parent of a node by `path` or `key`.

### `getFurthestInline`

`getFurthestInline(path: List|Array) => Node|Null`
`getFurthestInline(key: String) => Node|Null`

Get the furthest inline parent of a node by `path` or `key`.

### `getFurthestOnlyChildAncestor`

`getFurthestOnlyChildAncestor(path: List|Array) => Node|Null`
`getFurthestOnlyChildAncestor(key: String) => Node|Null`

Get the furthest ancestor of a node by `path` or `key` that has only one child.

### `getInlines`

`getInlines() => List`

Get all of the top-most [`Inline`](./inline.md) nodes in a node.

### `getLeafInlinesAtRange`

`getLeafInlinesAtRange(range: Range) => List`

Get all of the bottom-most [`Inline`](./inline.md) nodes in a `range`.

### `getInlinesByType`

`getInlinesByType(type: string) => List`

Get all of the top-most [`Inline`](./inline.md) nodes by `type`.

### `getLastText`

`getLastText() => Node|Void`

Get the last child text node inside a node.

### `getMarks`

`getMarks(range: Range) => Set`

Get a set of all of the marks in a node.

### `getMarksAtRange`

`getMarksAtRange(range: Range) => Set`

Get a set of all of the marks in a `range`.

### `getMarksByType`

`getMarksByType(type: String) => Set`

Get a set of all of the marks by `type`.

### `getNextBlock`

`getNextBlock(path: List|Array) => Node|Void`
`getNextBlock(key: String) => Node|Void`

Get the next, bottom-most [`Block`](./block.md) node after a descendant by `path` or `key`.

### `getNextNode`

`getNextNode(path: List|Array) => Node|Void`
`getNextNode(key: String) => Node|Void`

Get the next node in the tree of a descendant by `path` or `key`. This will not only check for siblings but instead move up the tree returning the next ancestor if no sibling is found.

### `getNextSibling`

`getNextSibling(path: List|Array) => Node|Void`
`getNextSibling(key: String) => Node|Void`

Get the next sibling of a descendant by `path` or `key`.

### `getNextText`

`getNextText(path: List|Array) => Node|Void`
`getNextText(key: String) => Node|Void`

Get the next [`Text`](./text.md) node after a descendant by `path` or `key`.

### `getNode`

`getNode(path: List|Array) => Node|Void`
`getNode(key: String) => Node|Void`

Get a node in the tree by `path` or `key`.

### `getNodesAtRange`

`getNodesAtRange(range: Range) => List`

Get all of the nodes in a `range`. This includes all of the [`Text`](./text.md) nodes inside the range and all ancestors of those [`Text`](./text.md) nodes up to this node.

### `getOffset`

`getOffset(path: List|Array) => Number`
`getOffset(key: String) => Number`

Get the text offset of a descendant in the tree by `path` or `key`.

### `getParent`

`getParent(path: List|Array) => Node|Void`
`getParent(key: String) => Node|Void`

Get the parent node of a descendant by `path` or `key`.

### `getPath`

`getPath(path: List|Array) => Node|Void`
`getPath(key: String) => Node|Void`

Get the path to a descendant by `path` or `key`.

### `getPreviousBlock`

`getPreviousBlock(path: List|Array) => Node|Void`
`getPreviousBlock(key: String) => Node|Void`

Get the previous, bottom-most [`Block`](./block.md) node before a descendant by `path` or `key`.

### `getPreviousNode`

`getPreviousNode(path: List|Array) => Node|Void`
`getPreviousNode(key: String) => Node|Void`

Get the previous node in the tree of a descendant by `path` or `key`. This will not only check for siblings but instead move up the tree returning the previous ancestor if no sibling is found.

### `getPreviousSibling`

`getPreviousSibling(path: List|Array) => Node|Void`
`getPreviousSibling(key: String) => Node|Void`

Get the previous sibling of a descendant by `path` or `key`.

### `getPreviousText`

`getPreviousText(path: List|Array) => Node|Void`
`getPreviousText(key: String) => Node|Void`

Get the previous [`Text`](./text.md) node before a descendant by `path` or `key`.

### `getRootBlocksAtRange`

`getRootBlocksAtRange(range: Range) => List`

Get all of the top-most [`Block`](./block.md) nodes in a `range`.

### `getRootInlinesAtRange`

`getRootInlinesAtRange(range: Range) => List`

Get all of the top-most [`Inline`](./inline.md) nodes in a `range`.

### `getTextAtOffset`

`getTextAtOffset(offset: Number) => Text || Void`

Get the [`Text`](./text.md) node at an `offset`.

### `getTextDirection`

`getTextDirection() => String`

Get the direction of the text content in the node.

### `getTexts`

`getTexts(range: Range) => List`

Get all of the [`Text`](./text.md) nodes in a node.

### `getTextsAtRange`

`getTextsAtRange(range: Range) => List`

Get all of the [`Text`](./text.md) nodes in a `range`.

### `hasChild`

`hasChild(path: List|Array) => Boolean`
`hasChild(key: String) => Boolean`

Check whether the node has a child node by `path` or `key`.

### `hasDescendant`

`hasDescendant(path: List|Array) => Boolean`
`hasDescendant(key: String) => Boolean`

Check whether the node has a descendant node by `path` or `key`.

### `hasNode`

`hasNode(path: List|Array) => Boolean`
`hasNode(key: String) => Boolean`

Check whether a node exists in the tree by `path` or `key`.

### `isNodeInRange`

`isNodeInRange(path: List|Array) => Boolean`
`isNodeInRange(key: String) => Boolean`

Check whether a node is inside a `range`. This will return true for all [`Text`](./text.md) nodes inside the range and all ancestors of those [`Text`](./text.md) nodes up to this node.
