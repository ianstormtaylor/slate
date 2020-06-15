# `Inline`

```js
import { Inline } from 'slate'
```

A inline node in a Slate [`Document`](./document.md). Inline nodes implement the [`Node`](./node.md) interface.

Inline nodes may contain nested inline nodes and text nodes—just like in the DOM. They always contain at least one text node child.

## Properties

```js
Inline({
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

An immutable string value of `'inline'` for easily separating this node from [`Block`](./block.md) or [`Text`](./text.md) nodes.

### `nodes`

`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `type`

`String`

The custom type of the node (eg. `link` or `hashtag`).

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.

## Static Methods

### `Inline.create`

`Inline.create(properties: Object) => Inline`

Create an inline from a plain JavaScript object of `properties`.

### `Inline.createList`

`Inline.createList(array: Array) => List`

Create a list of inline nodes from a plain JavaScript `array`.

### `Inline.fromJSON`

`Inline.fromJSON(object: Object) => Inline`

Create an inline from a JSON `object`.

### `Inline.isInline`

`Inline.isInline(maybeInline: Any) => Boolean`

Returns a boolean if the passed in argument is a `Inline`.

## Node Methods

Inlines implement the [`Node`](./node.md) interface. For information about all of the node methods, see the [`Node` reference](./node.md).

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the inline.
