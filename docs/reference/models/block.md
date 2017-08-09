
# `Block`

```js
import { Block } from 'slate'
```

A block node in a Slate [`Document`](./document.md). Block nodes implement the [`Node`](./node.md) interface.

Block nodes may contain nested block nodes, inline nodes, and text nodes—just like in the DOM. They always contain at least one text node child.

- [Properties](#properties)
  - [`data`](#data)
  - [`isVoid`](#isvoid)
  - [`key`](#key)
  - [`nodes`](#nodes)
  - [`type`](#type)
- [Computed Properties](#computed-properties)
  - [`kind`](#kind)
  - [`length`](#length)
  - [`text`](#text)
- [Static Methods](#static-methods)
  - [`Block.create`](#blockcreate)
  - [`Block.createList`](#blockcreatelist)
  - [`Block.isBlock`](#blockisblock)
- [Node Methods](#node-methods)


## Properties

```js
Block({
  data: Data,
  isVoid: Boolean,
  key: String,
  nodes: Immutable.List<Node>,
  type: String
})
```

### `data`
`Immutable.Map`

Arbitrary data associated with the node. Defaults to an empty `Map`.

### `isVoid`
`Boolean`

Whether the node is a "void" node, meaning that it has no child content (eg. images, videos, etc.). Defaults to `false`.

Note that even though a node may be "void", it will still contain a single, empty [`Text`](./text.md) node for consistency across other operations. However, when rendered by Slate that single [`Text`](./text.md) node will not be visible.

### `key`
`String`

A unique identifier for the node.

### `nodes`
`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `type`
`String`

The custom type of the node (eg. `blockquote` or `list-item`).


## Computed Properties

### `kind`
`String`

An immutable string value of `'block'` for easily separating this node from [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

### `length`
`Number`

The sum of the lengths of all of the descendant [`Text`](./text.md) nodes of this node.

### `text`
`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.


## Static Methods

### `Block.create`
`Block.create(properties: Object) => Block`

Create a block from a plain Javascript object of `properties`.

### `Block.createList`
`Block.createList(array: Array) => List`

Create a list of block nodes from a plain Javascript `array`.

### `Block.isBlock`
`Block.isBlock(maybeBlock: Any) => Boolean`

Returns a boolean if the passed in argument is a `Block`.

## Node Methods

Blocks implement the [`Node`](./node.md) interface. For information about all of the node methods, see the [`Node` reference](./node.md).
