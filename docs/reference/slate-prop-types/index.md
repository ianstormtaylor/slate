# `slate-prop-types`

```js
import Types from '@gitbook/slate-prop-types'
```

A set of React prop types for Slate editors and plugins.

## Example

```js
import React from 'react'
import Types from '@gitbook/slate-prop-types'

class Toolbar extends React.Component {

  propTypes = {
    block: Types.block,
    schema: Types.schema.isRequired,
    value: Types.value.isRequired,
  }

  ...

}
```

## Exports

### `block`

Ensure that a value is a Slate `Block`.

### `blocks`

Ensure that a value is an immutable `List` of Slate [`Block`](../slate/block.md) objects.

### `change`

Ensure that a value is a Slate `Change`.

### `character`

Ensure that a value is a Slate `Character`.

### `characters`

Ensure that a value is an immutable `List` of Slate [`Character`](../slate/character.md) objects.

### `data`

Ensure that a value is a Slate `Data`.

### `document`

Ensure that a value is a Slate `Document`.

### `history`

Ensure that a value is a Slate `History`.

### `inline`

Ensure that a value is a Slate `Inline`.

### `inlines`

Ensure that a value is an immutable `List` of Slate [`Inline`](../slate/inline.md) objects.

### `leaf`

Ensure that a value is a Slate `Leaf`.

### `leaves`

Ensure that a value is an immutable `List` of Slate [`Leaf`](../slate/leaf.md) objects.

### `mark`

Ensure that a value is a Slate `Mark`.

### `marks`

Ensure that a value is an immutable `Set` of Slate [`Mark`](../slate/mark.md) objects.

### `node`

Ensure that a value is a Slate `Node`.

### `nodes`

Ensure that a value is an immutable `List` of Slate [`Node`](../slate/mark.md) objects.

### `range`

Ensure that a value is a Slate `Range`.

### `ranges`

Ensure that a value is an immutable `List` of Slate [`Range`](../slate/range.md) objects.

### `schema`

Ensure that a value is a Slate `Schema`.

### `stack`

Ensure that a value is a Slate `Stack`.

### `text`

Ensure that a value is a Slate [`Text`](../slate/text.md).

### `texts`

Ensure that a value is an immutable `List` of Slate [`Text`](../slate/text.md) objects.

### `value`

Ensure that a value is a Slate `Value`.
