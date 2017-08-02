
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
  - [`length`](#length)
  - [`text`](#text)
- [Static Methods](#static-methods)
  - [`Text.create`](#textcreate)
  - [`Text.createFromString`](#textcreatefromstring)
  - [`Text.createFromRanges`](#textcreatefromranges)
  - [`Text.isText`](#textistext)

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

### `length`
`Number`

The length of all of the characters in the text node.

### `text`
`String`

A concatenated string of all of the characters in the text node.


## Static Methods

### `Text.create`
`Text.create(properties: Object) => Text`

Create a text from a plain Javascript object of `properties`.

### `Text.createFromRanges`
`Text.createFromRanges(ranges: List<Range>) => Text`

Create a text from a list of text ranges.

### `Text.createFromString`
`Text.createFromString(text: String, marks: Set) => Text`

Create a text from a plain `String` and a set of marks.

### `Text.isText`
`Text.isText(maybeText: Any) => Boolean`

Returns a boolean if the passed in argument is a `Text`.
