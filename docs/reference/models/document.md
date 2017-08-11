
# `Document`

```js
import { Document } from 'slate'
```

The top-level node in Slate's document model.

Documents are made up of block nodes, inline nodes, and text nodes—just like in the DOM. Note that direct descendants of a document node have to be block nodes.

In some places, you'll see mention of "fragments", which are also `Document` objects, just that aren't attached to the main `State`. For example, when cutting-and-pasting a selection of content, that content will be referred to as a document "fragment".

- [Properties](#properties)
  - [`data`](#data)
  - [`nodes`](#nodes)
- [Computed Properties](#computed-properties)
  - [`kind`](#kind)
  - [`length`](#length)
  - [`text`](#text)
- [Static Methods](#static-methods)
  - [`Document.create`](#documentcreate)
  - [`Document.isDocument`](#documentisdocument)
- [Node Methods](#node-methods)


## Properties

```js
Document({
  nodes: Immutable.List<Node>,
})
```

### `data`
`Immutable.Map`

Arbitrary data associated with the document. Defaults to an empty `Map`.

### `nodes`
`Immutable.List`

A list of child nodes.


## Computed Properties

### `kind`
`String`

An immutable string value of `'document'` for easily separating this node from [`Block`](./block.md), [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

### `length`
`Number`

The sum of the lengths of all of the descendant [`Text`](./text.md) nodes of this node.

### `text`
`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.


## Static Methods

### `Document.create`
`Document.create(properties: Object) => Document`

Create a block from a plain Javascript object of `properties`.

### `Document.isDocument`
`Document.isDocument(maybeDocument: Any) => Boolean`

Returns a boolean if the passed in argument is a `Document`.


## Node Methods

Documents implement the [`Node`](./node.md) interface. For information about all of the node methods, see the [`Node` reference](./node.md).
