
# `Document`

```js
import { Document } from 'slate'
```

The top-level node in Slate.

Documents are made up of block nodes, inline nodes, and text nodes—just like in the DOM.

- [Properties](#properties)
  - [`nodes`](#nodes)
- [Computed Properties](#computed-properties)
  - [`kind`](#kind)
  - [`length`](#length)
  - [`text`](#text)
- [Node Methods](#node-methods)


## Properties

```js
Document({
  nodes: Immutable.List,
})
```

### `nodes`
`Immutable.List`

A list of child nodes.


## Computed Properties

### `kind`
`String`

An immutable string value of `'document'` for easily separating this node from [`Block`](./block.dm), [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

### `length`
`Number`

The sum of the lengths of all of the descendant [`Text`](./text.md) nodes of this node.

### `text`
`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.


## Node Methods

Documents implement the [`Node`](./node.md) interface. For information about their methods, see the [`Node` reference](./node.md).
