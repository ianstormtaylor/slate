# `Document`

```js
import { Document } from 'slate'
```

The top-level node in Slate's document model.

Documents are made up of block nodes, inline nodes, and text nodes—just like in the DOM. Note that direct descendants of a document node have to be block nodes.

In some places, you'll see mention of "fragments", which are also `Document` objects, just that aren't attached to the main `Value`. For example, when cutting-and-pasting a selection of content, that content will be referred to as a document "fragment".

## Properties

```js
Document({
  nodes: Immutable.List<Node>,
})
```

### `data`

`Immutable.Map`

Arbitrary data associated with the document. Defaults to an empty `Map`.

### `object`

`String`

An immutable string value of `'document'` for easily separating this node from [`Block`](./block.md), [`Inline`](./inline.md) or [`Text`](./text.md) nodes.

### `nodes`

`Immutable.List`

A list of child nodes.

## Computed Properties

### `text`

`String`

A concatenated string of all of the descendant [`Text`](./text.md) nodes of this node.

## Static Methods

### `Document.create`

`Document.create(properties: Object) => Document`

Create a document from a plain JavaScript object of `properties`.

### `Document.fromJSON`

`Document.fromJSON(object: Object) => Document`

Create a document from a JSON `object`.

### `Document.isDocument`

`Document.isDocument(maybeDocument: Any) => Boolean`

Returns a boolean if the passed in argument is a `Document`.

## Node Methods

Documents implement the [`Node`](./node.md) interface. For information about all of the node methods, see the [`Node` reference](./node.md).

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the document.
