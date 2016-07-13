
# `Mark`

```js
import { Mark } from 'slate'
```

A formatting mark that can be associated with [`Characters`](./character.md). Marks are how Slate represents rich formatting like **bold** or _italic_.

- [Properties](#properties)
  - [`data`](#data)
  - [`type`](#type)
- [Static Methods](#static-methods)
  - [`Mark.create`](#mark-create)
  - [`Mark.createSet`](#mark-createset)


## Properties

```js
Mark({
  data: Data,
  type: String
})
```

### `data`
`Data`

A map of [`Data`](./data.md).

### `type`
`String`

The custom type of the mark (eg. `bold` or `italic`).


## Static Methods

### `Mark.create`
`Mark.create(properties: Object) => Mark`

Create a mark from a plain Javascript object of `properties`.

### `Mark.createSet`
`Mark.createSet(array: Array) => Set`

Create a set of marks from a plain Javascript `array`.
