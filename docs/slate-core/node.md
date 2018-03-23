# Node

`Node` is not a publicly accessible module, but instead an interface that [`Document`](document.md), [`Block`](block.md) and [`Inline`](inline.md) all implement.

## Properties

### `key`

`String`

A short-lived, unique identifier for the node.

By default, keys are **not** meant to be long-lived unique identifiers for nodes that you might store in a database, or elsewhere. They are meant purely to identify a node inside of a single Slate instance. For that reason, they are simply auto-incrementing strings. \(eg. `'0'`, `'1'`, `'2'`, ...\)

If you want to make your keys uniqueness long-lived, you'll need to supply your own key generating function via the [`setKeyGenerator`]() util.

### `nodes`

`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `object`

`String`

An immutable string value of `'document'`, `'block'`, `'inline'` or `'text'` for easily separating this node from [`Inline`](inline.md) or [`Text`](text.md) nodes.

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](text.md) nodes of this node.

## Methods

### `filterDescendants`

`filterDescendants(iterator: Function) => List`

Deeply filter the descendant nodes of a node by `iterator`.

### `findDescendant`

`findDescendant(iterator: Function) => Node || Void`

Deeply find a descendant node by `iterator`.

### `getBlocksAtRange`

`getBlocksAtRange(range: Range) => List`

Get all of the bottom-most [`Block`](block.md) nodes in a `range`.

### `getBlocks`

`getBlocks() => List`

Get all of the bottom-most [`Block`](block.md) node descendants.

### `getCharactersAtRange`

`getCharactersAtRange(range: Range) => List`

Get a list of all of the [`Characters`](character.md) in a `range`.

### `getChild`

`getChild(key: String || Node) => Node || Void`

Get a child by `key`.

### `getClosestBlock`

`getClosestBlock(key: String || Node) => Node || Void`

Get the closest [`Block`](block.md) node to a descendant node by `key`.

### `getClosestInline`

`getClosestInline(key: String || Node) => Node || Void`

Get the closest [`Inline`](inline.md) node to a descendant node by `key`.

### `getClosest`

`getClosest(key: String || Node, match: Function) => Node || Void`

Get the closest parent node of a descendant node by `key` that matches a `match` function.

### `getDepth`

`getDepth(key: String || Node) => Number`

Get the depth of a descendant node by `key`.

### `getDescendant`

`getDescendant(key: String || Node) => Node || Void`

Get a descendant node by `key`.

### `getFirstText`

`getFirstText() => Node || Void`

Get the first child text node inside a node.

### `getFragmentAtRange`

`getFragmentAtRange(range: Range) => Document`

Get a document fragment of the nodes in a `range`.

### `getFurthest`

`getFurthest(key: String, iterator: Function) => Node || Null`

Get the furthest parent of a node by `key` that matches an `iterator`.

### `getFurthestAncestor`

`getFurthestAncestor(key: String) => Node || Null`

Get the furthest ancestor of a node by `key`.

### `getFurthestBlock`

`getFurthestBlock(key: String) => Node || Null`

Get the furthest block parent of a node by `key`.

### `getFurthestInline`

`getFurthestInline(key: String) => Node || Null`

Get the furthest inline parent of a node by `key`.

### `getFurthestOnlyChildAncestor`

`getFurthestOnlyChildAncestor(key: String) => Node || Null`

Get the furthest ancestor of a node by `key` that has only one child.

### `getInlinesAtRange`

`getInlinesAtRange(range: Range) => List`

Get all of the top-most [`Inline`](inline.md) nodes in a `range`.

### `getLastText`

`getLastText() => Node || Void`

Get the last child text node inside a node.

### `getMarksAtRange`

`getMarksAtRange(range: Range) => Set`

Get a set of all of the marks in a `range`.

### `getNextBlock`

`getNextBlock(key: String || Node) => Node || Void`

Get the next, bottom-most [`Block`](block.md) node after a descendant by `key`.

### `getNextSibling`

`getNextSibling(key: String || Node) => Node || Void`

Get the next sibling of a descendant by `key`.

### `getNextText`

`getNextText(key: String || Node) => Node || Void`

Get the next [`Text`](text.md) node after a descendant by `key`.

### `getParent`

`getParent(key: String || Node) => Node || Void`

Get the parent node of a descendant by `key`.

### `getPreviousBlock`

`getPreviousBlock(key: String || Node) => Node || Void`

Get the previous, bottom-most [`Block`](block.md) node before a descendant by `key`.

### `getPreviousSibling`

`getPreviousSibling(key: String || Node) => Node || Void`

Get the previous sibling of a descendant by `key`.

### `getPreviousText`

`getPreviousText(key: String || Node) => Node || Void`

Get the previous [`Text`](text.md) node before a descendant by `key`.

### `getTextAtOffset`

`getTextAtOffset(offset: Number) => Text || Void`

Get the [`Text`](text.md) node at an `offset`.

### `getTextsAtRange`

`getTextsAtRange(range: Range) => List`

Get all of the [`Text`](text.md) nodes in a `range`.

### `hasChild`

`hasChild(key: String || Node) => Boolean`

Check whether the node has a child node by `key`.

### `hasDescendant`

`hasDescendant(key: String || Node) => Boolean`

Check whether the node has a descendant node by `key`.

