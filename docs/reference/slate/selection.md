# `Selection`

```js
import { Selection } from 'slate'
```

The user's current selection in a Slate [`Document`](./document.md). Selections implement the [`Range`](./range.md) interface, but also expose data about the current "focus" and the cursor current marks.

## Properties

```js
Selection({
  anchor: Point,
  focus: Point,
  isFocused: Boolean,
  marks: Set,
})
```

### `isFocused`

`Boolean`

Whether the range currently has focus.

### `marks`

`Set`

A set of marks associated with the range.

### `object`

`String`

A string with a value of `'selection'`.

## Computed Properties

### `isBlurred`

`Boolean`

The opposite of `isFocused`, for convenience.

## Static Methods

### `Selection.create`

`Selection.create(properties: Object) => Selection`

Create a new `Selection` instance with `properties`.

### `Selection.createProperties`

`Selection.createProperties(object: Object|Selection) => Object`

Create a new dictionary of range properties from an `object`.

### `Selection.fromJSON`

`Selection.fromJSON(object: Object) => Selection`

Create a range from a JSON `object`.

### `Selection.isSelection`

`Selection.isSelection(value: Any) => Boolean`

Check whether a `value` is a `Selection`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Return a JSON representation of the range.

## Mutating Methods

### `setIsFocused`

`setIsFocused(isFocused: Boolean) => Selection`

Return a new range with a new `isFocused` value.

### `setMarks`

`setMarks(marks: Set|Null) => Selection`

Return a new range with a new set of `marks`.
