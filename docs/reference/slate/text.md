# `Text`

```js
import { Text } from 'slate'
```

A text node in a Slate [`Document`](./document.md). Text nodes are always the bottom-most leaves in the document, just like in the DOM.

## Properties

```js
Text({
  key: String,
  text: String,
  marks: Immutable.List<Mark>,
})
```

### `key`

`String`

A unique identifier for the node.

### `text`

`String`

The text contents of this node.

### `marks`

`Immutable.Set<Mark>,`

A list of marks for this node.

### `object`

`String`

An immutable string value of `'text'` for easily separating this node from [`Inline`](./inline.md) or [`Block`](./block.md) nodes.

## Static Methods

### `Text.create`

`Text.create(properties: Object) => Text`

Create a text from a plain JavaScript object of `properties`.

### `Text.fromJSON`

`Text.fromJSON(object: Object) => Text`

Create a text from a JSON `object`.

### `Text.isText`

`Text.isText(maybeText: Any) => Boolean`

Returns a boolean if the passed in argument is a `Text`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the text.
