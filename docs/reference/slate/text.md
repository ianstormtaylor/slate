
# `Text`

```js
import { Text } from 'slate'
```

A text node in a Slate [`Document`](./document.md). Text nodes are always the bottom-most leaves in the document, just like in the DOM.

- [Properties](#properties)
  - [`characters`](#characters)
  - [`key`](#key)
- [Computed Properties](#computed-properties)
  - [`kind`](#kind)
  - [`text`](#text)
- [Static Methods](#static-methods)
  - [`Text.create`](#textcreate)
  - [`Text.fromJSON`](#textfromjson)
  - [`Text.isText`](#textistext)
- [Instance Methods](#instance-methods)
  - [`toJSON`](#tojson)

## Properties

```js
Text({
  characters: Immutable.List<Character>,
  key: String
})
```

### `characters`

A list of [`Characters`](./character.md) with associated [`Marks`](./mark.md) that make up the text node's content.

### `key`
`String`

A unique identifier for the node.


## Computed Properties

### `kind`
`String`

An immutable string value of `'text'` for easily separating this node from [`Inline`](./inline.md) or [`Block`](./block.md) nodes.

### `text`
`String`

A concatenated string of all of the characters in the text node.


## Static Methods

### `Text.create`
`Text.create(properties: Object) => Text`

Create a text from a plain Javascript object of `properties`.

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
