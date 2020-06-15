# `Block`

```js
import { Block } from 'slate'
```

A block node in a Slate [`Document`](./document.md). Block nodes implement the [`Node`](./node.md) interface.

Block nodes may contain nested block nodes, inline nodes, and text nodes—just like in the DOM. They always contain at least one text node child.

## Properties

```js
Block({
  data: Data,
  key: String,
  nodes: Immutable.List<Node>,
  type: String
})
```

### `data`

`Immutable.Map`

Arbitrary data associated with the node. Defaults to an empty `Map`.

### `key`

`String`

A unique identifier for the node.

### `object`

`String`

An immutable string value of `'block'` for easily separating this node from [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

### `nodes`

`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `type`

`String`

The custom type of the node (eg. `blockquote` or `list-item`).

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.

## Static Methods

### `Block.create`

`Block.create(properties: Object) => Block`

Create a block from a plain JavaScript object of `properties`.

### `Block.createList`

`Block.createList(array: Array) => List`

Create a list of block nodes from a plain JavaScript `array`.

### `Block.fromJSON`

`Block.fromJSON(object: Object) => Block`

Create a block from a JSON `object`.

### `Block.isBlock`

`Block.isBlock(maybeBlock: Any) => Boolean`

Returns a boolean if the passed in argument is a `Block`.

## Node Methods

Blocks implement the [`Node`](./node.md) interface. For information about all of the node methods, see the [`Node` reference](./node.md).

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the block.
