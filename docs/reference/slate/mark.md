# `Mark`

```js
import { Mark } from 'slate'
```

A formatting mark that can be associated with characters. Marks are how Slate represents rich formatting like **bold** or _italic_.

## Properties

```js
Mark({
  data: Data,
  type: String,
})
```

### `data`

`Data`

A map of [`Data`](./data.md).

### `object`

`String`

A string with a value of `'mark'`.

### `type`

`String`

The custom type of the mark (eg. `bold` or `italic`).

## Static Methods

### `Mark.create`

`Mark.create(properties: Object) => Mark`

Create a mark from a plain JavaScript object of `properties`.

### `Mark.createSet`

`Mark.createSet(array: Array) => Set`

Create a set of marks from a plain JavaScript `array`.

### `Mark.fromJSON`

`Mark.fromJSON(object: Object) => Mark`

Create a mark from a JSON `object`.

### `Mark.isMark`

`Mark.isMark(maybeMark: Any) => Boolean`

Returns a boolean if the passed in argument is a `Mark`.

## Instance Methods

### `toJSON`

`toJSON() => Object`

Returns a JSON representation of the mark.
