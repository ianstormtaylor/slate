
# `Block`

```js
import { Block } from 'slate'
```

A block node in a Slate [`Document`](./document.md).

Block nodes can contained nested block nodes, inline nodes, and text nodes—just like in the DOM. They always contain at least one text node child.

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
- [Node Methods](#node-methods)

## Properties

```js
Block({
  data: Immutable.Map,
  isVoid: Boolean,
  key: String,
  nodes: Immutable.List,
  type: String
})
```

### `data`
`Immutable.Map`

Arbitrary data associated with the block. Defaults to an empty `Map`.

### `isVoid`
`Boolean`

Whether the node is a "void" node, meaning that it has no child content (eg. images, videos, etc.). Defaults to `false`.

Note that even though a node may be "void", it will still contain a single, empty [`Text`](./text.md) node for consistency across other operations. However, when rendered by Slate that single text node will not be visible.

### `key`
`String`

A unique identifier for the node.

### `nodes`
`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `type`
`String`

The custom type of the block (eg. `blockquote` or `list-item`).


## Computed Properties

### `kind`
`String`

An immutable string value of `'block'` for easily separating this node from inline or text nodes.

### `length`
`Number`

The sum of the lengths of all of the descendant [`Text`](./text.md) nodes of this node.

### `text`
`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.


## Node Methods

Blocks implement the [`Node`](./node.md) interface. For information about their methods, see the [`Node` reference](./node.md).
