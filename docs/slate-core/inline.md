# Inline

```javascript
import { Inline } from 'slate'
```

A inline node in a Slate [`Document`](document.md). Inline nodes implement the [`Node`](node.md) interface.

Inline nodes may contain nested inline nodes and text nodes—just like in the DOM. They always contain at least one text node child.

## Properties

```javascript
Inline({
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

Whether the node is a "void" node, meaning that it has no child content \(eg. emoji, icons, etc.\). Defaults to `false`.

Note that even though a node may be "void", it will still contain a single, empty [`Text`](text.md) node for consistency across other operations. However, when rendered by Slate that single [`Text`](text.md) node will not be visible.

### `key`

`String`

A unique identifier for the node.

### `object`

`String`

An immutable string value of `'inline'` for easily separating this node from [`Block`](block.md) or [`Text`](text.md) nodes.

### `nodes`

`Immutable.List`

A list of child nodes. Defaults to a list with a single text node child.

### `type`

`String`

The custom type of the node \(eg. `link` or `hashtag`\).

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](text.md) nodes of this node.

## Static Methods

### `Inline.create`

`Inline.create(properties: Object) => Inline`

Create an inline from a plain Javascript object of `properties`.

### `Inline.createList`

`Inline.createList(array: Array) => List`

Create a list of inline nodes from a plain Javascript `array`.

### `Inline.fromJSON`

`Inline.fromJSON(object: Object) => Inline`

Create an inline from a JSON `object`.

### `Inline.isInline`

`Inline.isInline(maybeInline: Any) => Boolean`

Returns a boolean if the passed in argument is a `Inline`.

## Node Methods

Inlines implement the [`Node`](node.md) interface. For information about all of the node methods, see the [`Node` reference](node.md).

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the inline.

