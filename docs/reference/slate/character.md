
# `Character`

```js
import { Character } from 'slate'
```

A character in a [`Text`](./text.md) node.

Characters are how Slate associates [`Marks`](./mark.md) with a range of text, for formatting.

- [Properties](#properties)
  - [`marks`](#marks)
  - [`text`](#text)
- [Static Methods](#static-methods)
  - [`Character.create`](#charactercreate)
  - [`Character.createList`](#charactercreatelist)
  - [`Character.fromJSON`](#characterfromjson)
  - [`Character.isCharacter`](#characterischaracter)
- [Instance Methods](#instance-methods)
  - [`toJSON`](#tojson)


## Properties

```js
Character({
  marks: Immutable.Set<Mark>,
  text: String
})
```

### `marks`
`Immutable.Set`

A set of [`Marks`](./mark.md) attached to the character.

### `text`
`String`

The text string of the character.


## Static Methods

### `Character.create`
`Character.create(properties: Object) => Character`

Create a character from a plain Javascript object of `properties`.

### `Character.createList`
`Character.createList(array: Array) => List`

Create a list of characters from a plain Javascript `array`.

### `Character.fromJSON`
`Character.fromJSON(object: Object) => Character`

Create a character from a JSON `object`.

### `Character.isCharacter`
`Character.isCharacter(maybeCharacter: Any) => Boolean`

Returns a boolean if the passed in argument is a `Character`.


## Instance Methods

### `toJSON`
`toJSON() => Object`

Returns a JSON representation of the character.
